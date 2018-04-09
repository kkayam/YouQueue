var vid = document.getElementsByClassName('video-stream')[0];

chrome.runtime.sendMessage({type: "tabid"});

function next(){
  var videoqueue;
  chrome.storage.local.get({'queue':[]}, function(result) {
          videoqueue=result.queue;
          var vidurl = videoqueue[0];
          videoqueue.shift();
          chrome.storage.local.set({'queue': videoqueue}, function() {
                });
          window.location.href = vidurl;
        });
}

vid.onended = function(e) {
    next()
  }
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.message == "next")
        next();
  });
