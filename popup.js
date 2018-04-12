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
var apiKey = AIzaSyBzLH4gRgoGJu2hK9ALogIIvRDs_4v7Fec;

function writeOutQueue() {
    getTabid();
    queueText.innerHTML="";
    alert(0);
    chrome.storage.local.get({
        'queue': []
    }, function(result) {
      alert(1);
        for (var i = 0; i < result.queue.length; i++) {
          alert(1.5);
          var videoId = result.queue[i].slice((result.queue[i].indexOf("?v=")+3),(result.queue[i].indexOf("?v=")+14));
            $.ajax({
                url: "https://www.googleapis.com/youtube/v3/videos?id=" + videoId + "&key=" + apiKey + "&fields=items(snippet(title))&part=snippet",
                dataType: "jsonp",
                success: function(data) {
                    alert(data.items[0].snippet.title);
                    queueText.innerHTML +=data.items[0].snippet.title;
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    alert(textStatus, +' | ' + errorThrown);
                }
            });
        }
    });
}

function next() {
    chrome.storage.local.get({
        'queue': []
    }, function(result) {
        videoqueue = result.queue;
        var vidurl = videoqueue[0];
        videoqueue.shift();
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