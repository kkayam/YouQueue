var tabid;
var apiKey = "AIzaSyDFU2ViycjJgbrpgxYQF5aVrnL7l9vQ9Mw";
// Start by setting the queuetab to none and storing it
saveTabInfo(null);

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


// Save the tabid to the local storage
function saveTabInfo(newtabid) {
    chrome.storage.local.set({
        'tab': newtabid
    }, function() {});
}

// Save the PIP state to the local storage
// function savePIPInfo(newState) {
//     chrome.storage.local.set({
//         'pip': newState
//     }, function() {});
// }

// CONTEXT MENUS
chrome.contextMenus.create({
    id: "playnext",
    title: "Play next",
    contexts: ["link"],
    targetUrlPatterns: ["https://www.youtube.com/watch*"]
});

// LISTENERS
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === "playnext") {
        addNext(info, tab);
    }
});

// if the queue tab is closed
chrome.tabs.onRemoved.addListener(function(closedtabid, removed) {
    if (closedtabid == tabid) {
        chrome.tabs.query({ url: "https://www.youtube.com/*" }, function(tabs) {
            if (tabs.length > 0) {
                saveTabInfo(tabs[0].id);
            } else {
                saveTabInfo(null);
            }
        });
    }
});

// Update current tabid if the selected tab leaves youtube
chrome.tabs.onUpdated.addListener(function(updatedTabid, changeInfo, tab) {
    if (updatedTabid == tabid && changeInfo.url) {
        if (!changeInfo.url.match(/youtube\.com/)) {
            chrome.tabs.query({ url: "https://www.youtube.com/*" }, function(tabs) {
                if (tabs.length > 0) {
                    saveTabInfo(tabs[0].id);
                } else {
                    saveTabInfo(null);
                }
            });
        }
    }
});

// if the background script receives a message (probably from the content script)
chrome.runtime.onMessage.addListener(
    function(msg, sender, sendresponse) {
        if (msg.type == "newtab" && !tabid && tabid != "paused") { // New tab opened
            saveTabInfo(sender.tab.id);
        } else if (msg.type == "next" && sender.tab.id == tabid) { // Video ended in a tab
            next(tabid);
        } else if (msg.type == "forcenext") { // User clicked play next in one of the tabs
            next(sender.tab.id);
        } else if (msg.type == "playnexthere") { // User clicked the "Q here" button in one of the tabs
            if (tabid == sender.tab.id) { // if the tab is already selected, pause the queue
                saveTabInfo("paused");
            } else { //else queue to this tab
                saveTabInfo(sender.tab.id);
            }
        } else if (msg.type == "check") { // One of the content scripts is asking if he is the selected tab
            if (tabid == sender.tab.id) {
                sendresponse({
                    response: "selected"
                });
            } else {
                sendresponse({
                    response: "notselected"
                });
            }
        } else if (msg.type == "openurl") { // Popup wants background script to open a new tab with url
            chrome.tabs.create({
                url: msg.newurl
            }, function(tab) {
                chrome.storage.local.set({
                    'tab': tab.id
                }, function() {});
            });
        } else if (msg.type == "playing") { // One of the content scripts is asking if he is the selected tab
            if (tabid == sender.tab.id) {
                if (msg.state) {
                    chrome.storage.local.set({
                        'playing': true
                    }, function() {});
                } else {
                    chrome.storage.local.set({
                        'playing': false
                    }, function() {});
                }
            }

            // else if (msg.type == "pip") { // User clicked picture-in-picture
            //     if (tabid == sender.tab.id) {
            //         savePIPInfo(msg.state);
            //     }
            // }
        }
    });

// Play next when video ends
function next(tabtoupdate) {
    var videoqueue;
    // Get queue from storage
    chrome.storage.local.get({
        'queue': []
    }, function(result) {
        if (result.queue.length > 0) {
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

chrome.commands.onCommand.addListener(function(command) {
    if (command === "playpause") {
        chrome.storage.local.get({
            'playing': []
        }, function(result) {
            if (result.playing) {
                chrome.tabs.sendMessage(tabid, { type: "pause" });
            } else {
                chrome.tabs.sendMessage(tabid, { type: "play" });
            }
        });
    }
});

chrome.storage.onChanged.addListener(function(changes, areaName) {
    if (changes.tab) {
        tabid = changes.tab.newValue;
        if (tabid && tabid != "paused") { // If a tab is actually selected, let it know that it is selected
            chrome.tabs.sendMessage(tabid, { type: "selected" });
        }
        chrome.tabs.query({ url: "https://www.youtube.com/*" }, function(tabs) {
            tabs.forEach(function(tab) {
                if (tab.id != tabid) { // all other tabs can fuck off
                    chrome.tabs.sendMessage(tab.id, { type: "notselected" });
                }
            });
        });
    }
});