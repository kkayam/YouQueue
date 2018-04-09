function removeAll(){
  chrome.storage.local.set({'queue': []}, function(){
    writeOutQueue();
  });
}

function getTabid(){
  chrome.storage.local.get({'tab':[]}, function(result) {
    tabid=result.tab;
  });
}

var tabid;

function writeOutQueue(){
  getTabid();
  chrome.storage.local.get({'queue':[]}, function(result) {
    queueText.innerHTML=result.queue.join("<br/><br/>");
  });
}

function next(){
  chrome.storage.local.get({'queue':[]}, function(result) {
          videoqueue=result.queue;
          var vidurl = videoqueue[0];
          videoqueue.shift();
          chrome.storage.local.set({'queue': videoqueue}, function() {
            writeOutQueue();
          });
          chrome.tabs.update(tabid, {url: vidurl});
        });
}

var queueText = document.getElementById('queue');
var removeButton = document.getElementById('removeQueue');
var nextButton = document.getElementById('nextQueue');

window.onload = function() {
  writeOutQueue();
};

removeButton.addEventListener('click', function() {removeAll()});
nextButton.addEventListener('click', function() {next()});
