function removeAll(){
  chrome.storage.local.set({'queue': []}, function(){
    writeOutQueue();
  });
}

var tabid;

function writeOutQueue(){
  chrome.storage.local.get({'queue':[]}, function(result) {
    queueText.innerHTML=result.queue.join("<br/><br/>");
  });
  chrome.storage.local.get({'tab'}, function(result) {
    tabid=result.tab;
  });
}

function next(){
  chrome.tabs.sendMessage(tabid, {action: "next"});
}

var queueText = document.getElementById('queue');
var headerText = document.getElementById('header');
var removeButton = document.getElementById('removeQueue');
var refreshButton = document.getElementById('refreshQueue');
var nextButton = document.getElementById('nextQueue');
window.onload = function() {
    writeOutQueue();
};
removeButton.addEventListener('click', function() {removeAll()})
refreshButton.addEventListener('click', function() {writeOutQueue()})
nextButton.addEventListener('click', function() {next()})
