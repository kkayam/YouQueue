var tabid = "none";
var apiKey = "AIzaSyDFU2ViycjJgbrpgxYQF5aVrnL7l9vQ9Mw";
saveTabInfo();

function addNext(info, tab) {
    var videoqueue;
    chrome.storage.local.get({
        'queue': []
    }, function(result) {
        videoqueue = result.queue;
        var videoId = info.linkUrl.slice((info.linkUrl.indexOf("?v=") + 3), (info.linkUrl.indexOf("?v=") + 14));
        $.ajax({
            url: "https://www.googleapis.com/youtube/v3/videos?id=" + videoId + "&key=" + apiKey + "&fields=items(snippet(title))&part=snippet",
            dataType: "jsonp",
            success: function(data) {
                videoqueue.push([data.items[0].snippet.title, info.linkUrl]);
                chrome.storage.local.set({
                    'queue': videoqueue
                }, function() {});
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert(textStatus);
            }
        });
    });
}

function saveTabInfo() {
    chrome.storage.local.set({
        'tab': tabid
    }, function() {});
}

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

chrome.tabs.onRemoved.addListener(function(closedtabid, removed) {
    if (closedtabid == tabid) {
        tabid = "none";
        saveTabInfo();
    }
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

chrome.runtime.onMessage.addListener(
    function(msg, sender, sendResponse) {
        if (msg.type == "tabid" && tabid == "none")
            tabid = sender.tab.id;
        saveTabInfo();
    });