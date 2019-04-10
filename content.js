// Get the videoplayer
var vid = document.getElementsByClassName('video-stream')[0];

// Broadcast tabid to other scripts
chrome.runtime.sendMessage({
    type: "tabid"
});

// Play next when video ends
function next() {
    var videoqueue;
    // Get queue from storage
    chrome.storage.local.get({
        'queue': []
    }, function(result) {
        videoqueue = result.queue;
        // Get first video
        var vidurl = videoqueue[0][1];
        // Shift queue (remove the first video)
        videoqueue.shift();
        // Store shifted queue
        chrome.storage.local.set({
            'queue': videoqueue
        }, function() {});
        // Set url to video url
        window.location.href = vidurl;
    });
}

// Play next when video ends
vid.onended = function(e) {
    next()
}