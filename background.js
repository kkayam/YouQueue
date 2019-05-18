var tabid = "none";
var apiKey = "AIzaSyDFU2ViycjJgbrpgxYQF5aVrnL7l9vQ9Mw";
// Start by setting the queuetab to none and storing it
saveTabInfo();


// Add the video in 'info' to the queue
function addNext(info, tab) {
    var videoqueue;
    // Get the queue so we can change it correctly
    chrome.storage.local.get({
        'queue': []
    }, function(result) {
        videoqueue = result.queue;
        // Get the video id of the video to be queued
        var videoId = info.linkUrl.slice((info.linkUrl.indexOf("?v=") + 3), (info.linkUrl.indexOf("?v=") + 14));
        // Get the video title from google
        var url = "https://www.googleapis.com/youtube/v3/videos?id=" + videoId + "&key=" + apiKey + "&fields=items(snippet(title))&part=snippet";
        fetch(url)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                // Save the video title and video link :D
                videoqueue.push([data.items[0].snippet.title, info.linkUrl]);
                chrome.storage.local.set({
                    'queue': videoqueue // Save under the name 'queue'
                }, function() {});
            });
    });
}

// for notifications in the future
// chrome.browserAction.setBadgeBackgroundColor({
//     color: "#ffdd00ff"
// });

// Save the tabid to the local storage
function saveTabInfo() {
    chrome.storage.local.set({
        'tab': tabid
    }, function() {});
}


// CONTEXT MENUS
chrome.contextMenus.create({
    id: "playnext",
    title: "Play next",
    contexts: ["link"],
    targetUrlPatterns: ["https://www.youtube.com/watch*"]
});

chrome.contextMenus.create({
    id: "playnexthere",
    title: "Play next here",
    contexts: ["page"],
    documentUrlPatterns: ["https://www.youtube.com/*"]
});

// LISTENERS
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === "playnext") {
        addNext(info, tab);
    }
    if (info.menuItemId === "playnexthere") {
        tabid = tab.id;
        saveTabInfo();
    }
});

// if the queue tab is closed
chrome.tabs.onRemoved.addListener(function(closedtabid, removed) {
    if (closedtabid == tabid) {
        chrome.tabs.query({ url: "https://www.youtube.com/*" }, function(tabs) {
            tabid = "none";
            if (tabs.length > 0) {
                tabid = tabs[0].id;
            }
            saveTabInfo();
        });
    }
});

// if the background script receives a message (probably from the content script)
chrome.runtime.onMessage.addListener(
    function(msg, sender, sendresponse) {
        if (msg.type == "tabid" && tabid == "none") {
            tabid = sender.tab.id;
            saveTabInfo();
        } else if (msg.type == "next" && sender.tab.id == tabid) {
            next(tabid);
        } else if (msg.type == "forcenext") {
            next(sender.tab.id);
        } else if (msg.type == "playnexthere") {
            tabid = sender.tab.id;
            saveTabInfo();
        } else if (msg.type == "check") {
            if (tabid == sender.tab.id) {
                sendresponse({
                    response: "selected"
                });
            } else {
                sendresponse({
                    response: "notselected"
                });
            }
        }
    });

// Play next when video ends
function next(tabtoupdate) {
    var videoqueue;
    // Get queue from storage
    chrome.storage.local.get({
        'queue': []
    }, function(result) {
        if (result.queue.length>0) {
            videoqueue = result.queue;
            // Get first video
            var vidurl = videoqueue[0][1];
            // Shift queue (remove the first video)
            videoqueue.shift();
            // Store shifted queue
            chrome.storage.local.set({
                'queue': videoqueue
            }, function() {});
            // Set url to video url
            chrome.tabs.update(tabtoupdate, {
                url: vidurl
            });
        }
    });
}

chrome.storage.onChanged.addListener(function(changes, areaName) {
    if (changes.tab) {
        tabid = changes.tab.newValue;
        chrome.tabs.sendMessage(tabid, { type: "selected" });
        chrome.tabs.query({ url: "https://www.youtube.com/*" }, function(tabs) {
            tabs.forEach(function(tab) {
                if (tab.id != tabid) {
                    chrome.tabs.sendMessage(tab.id, { type: "notselected" });
                }
            });
        });
    }
});