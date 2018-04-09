function addNext(info,tab) {
  var videoqueue;
  chrome.storage.local.get({'queue':[]}, function(result) {
          videoqueue=result.queue;
          videoqueue.push(info.linkUrl);
          chrome.storage.local.set({'queue': videoqueue}, function() {});
        });
}

var tabid = "none";
saveTabInfo();

function saveTabInfo(){
  chrome.storage.local.set({'tab': tabid}, function() {});
}

chrome.contextMenus.create({
  id: "playnext",
  title: "Play next",
  contexts: ["link"]
});

chrome.contextMenus.create({
  id: "playnexthere",
  title: "Play next here",
  contexts: ["page"]
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === "playnext") {
        addNext(info,tab);
    }
    if (info.menuItemId === "playnexthere") {
      tabid=tab.id;
      saveTabInfo();
    }
});

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.type == "tabid" && tabid=="none")
      tabid = sender.tab.id;
      tabindex = sender.tab.index;
      saveTabInfo();
    });
