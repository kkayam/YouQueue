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
  chrome.tabs.sendMessage(tabid, {message:"next"}, function(response){});
  writeOutQueue();
}

var queueText = document.getElementById('queue');
var removeButton = document.getElementById('removeQueue');
var refreshButton = document.getElementById('refreshQueue');
var nextButton = document.getElementById('nextQueue');

window.onload = function() {
  writeOutQueue();
};

removeButton.addEventListener('click', function() {removeAll()});
refreshButton.addEventListener('click', function() {writeOutQueue()});
nextButton.addEventListener('click', function() {next()});
