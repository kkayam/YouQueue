var cached = [];
cached.push(location.href);

// Get the videoplayer
var vid = document.querySelectorAll(".video-stream");
if (vid.length > 0) {
    // Play next when video ends
    vid[0].onended = function(e) {
        next()
    }
}

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

// Add next to local queue storage
function addNext(name, nexturl) {
    var videoqueue;
    chrome.storage.local.get({
        'queue': []
    }, function(result) {
        videoqueue = result.queue;
        videoqueue.push([name, nexturl]);
        chrome.storage.local.set({
            'queue': videoqueue
        }, function() {});
    });
}


// Add button to div called dismissable
function injectButton(dismissable) {
    var thumbnailoverlay = dismissable.querySelector("ytd-thumbnail");
    if (thumbnailoverlay == null || thumbnailoverlay.querySelector(".addbutton") != null) {
        if (thumbnailoverlay == null) {
            return 0;
        } else if (thumbnailoverlay.querySelector(".addbutton") != null) {
            console.log("dublicate button");
        }
        return 0;
    }
    var thumbnail = dismissable.querySelector("#thumbnail");
    var title = dismissable.querySelector("#video-title");
    var img = document.createElement("img");
    img.src = chrome.extension.getURL("plus.png");
    img.style.width = "80%";
    img.style.height = "80%";
    img.style.verticalAlign = 'middle';
    var button = document.createElement("button");
    button.className = "addbutton";
    button.appendChild(img);
    button.onclick = function() {
        button.style.background = '#ff5f5f';
        button.style.borderColor = '#ff5f5f';
        addNext(title.getAttribute("title"), "https://www.youtube.com" + thumbnail.getAttribute("href"));
    };
    thumbnailoverlay.appendChild(button);
    return 1;
}

// When the "dismissable" div arrives, inject button
document.arrive("#dismissable", function() {
    injectButton(this);
});