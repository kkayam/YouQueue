var vid = document.getElementsByClassName('video-stream')[0];

chrome.runtime.sendMessage({
    type: "tabid"
});

function next() {
    var videoqueue;
    chrome.storage.local.get({
        'queue': []
    }, function(result) {
        videoqueue = result.queue;
        var vidurl = videoqueue[0][1];
        videoqueue.shift();
        chrome.storage.local.set({
            'queue': videoqueue
        }, function() {});
        window.location.href = vidurl;
    });
}

function addQueueButtons()
{
    var overlays = document.querySelectorAll('overlays');
    overlays.forEach(function(overlay,index) {
        var btn = document.createElement("BUTTON");
        var t = document.createTextNode("Heyy");
        btn.appendChild(t);
        overlay.appendChild(btn);
    });
}

addQueueButtons(); 

vid.onended = function(e) {
    next()
}