function removeAll() {
    chrome.storage.local.set({
        'queue': []
    }, function() {
        writeOutQueue();
    });
}

function getTabid() {
    chrome.storage.local.get({
        'tab': []
    }, function(result) {
        tabid = result.tab;
    });
}

var tabid;

function writeOutQueue() {
    getTabid();
    queueText.innerHTML = "";
    chrome.storage.local.get({
        'queue': []
    }, function(result) {
        for (var i = 0; i < result.queue.length; i++) {
            queueText.innerHTML += result.queue[i][0] + "<br>";
        }

    });
}

function next() {
    nextto(0);
}

function nextto(index) {
    chrome.storage.local.get({
        'queue': []
    }, function(result) {
        videoqueue = result.queue;
        var vidurl = videoqueue[index][1];
        videoqueue.splice(index, 1);
        chrome.storage.local.set({
            'queue': videoqueue
        }, function() {
            writeOutQueue();
        });
        chrome.tabs.update(tabid, {
            url: vidurl
        });
    });
}

var queueText = document.getElementById('queue');
var removeButton = document.getElementById('removeQueue');
var nextButton = document.getElementById('nextQueue');

window.onload = function() {
    writeOutQueue();
};

removeButton.addEventListener('click', function() {
    removeAll()
});
nextButton.addEventListener('click', function() {
    next()
});