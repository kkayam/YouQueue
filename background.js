var tabid = "none";
saveTabInfo();

function addNext(info, tab) {
    var videoqueue;
    chrome.storage.local.get({
        'queue': []
    }, function(result) {
        videoqueue = result.queue;
        videoqueue.push(info.linkUrl);
        chrome.storage.local.set({
            'queue': videoqueue
        }, function() {});
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
    documentUrlPatterns: ["https://www.youtube.com/*"]
});

chrome.contextMenus.create({
    id: "playnexthere",
    title: "Play next	here",
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