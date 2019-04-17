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
        $.ajax({
            url: "https://www.googleapis.com/youtube/v3/videos?id=" + videoId + "&key=" + apiKey + "&fields=items(snippet(title))&part=snippet",
            dataType: "jsonp",
            success: function(data) {
                // Save the video title and video link :D
                videoqueue.push([data.items[0].snippet.title, info.linkUrl]);
                chrome.storage.local.set({
                    'queue': videoqueue // Save under the name 'queue'
                }, function() {});
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert(textStatus);
            }
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

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === "playnext") {
        addNext(info, tab);
    }
    if (info.menuItemId === "playnexthere") {
        tabid = tab.id;
        saveTabInfo();
    }
});

// LISTENERS
// if the queue tab is closed
chrome.tabs.onRemoved.addListener(function(closedtabid, removed) {
    if (closedtabid == tabid) {
        tabid = "none";
        saveTabInfo();
    }
});

// if the background script receives a message (probably from the content script)
chrome.runtime.onMessage.addListener(
    function(msg, sender, sendResponse) {
        if (msg.type == "tabid" && tabid == "none")
            tabid = sender.tab.id;
        saveTabInfo();
    });