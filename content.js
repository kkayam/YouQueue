var cached = [];
cached.push(location.href);
var sidenav;

// Get the videoplayer
var vid = document.querySelectorAll(".video-stream");
if (vid.length > 0) {
    // Play next when video ends
    vid[0].onended = function(e) {
        nextMessage()
    }
}


// Tell the background that the video is done
function nextMessage() {
    chrome.runtime.sendMessage({
        type: "next"
    });
}

// Broadcast tabid to other scripts
chrome.runtime.sendMessage({
    type: "tabid"
});


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


function injectSidenav() {
    sidenav = document.createElement("div");
    sidenav.id = "mySidenav";
    sidenav.className = "sidenav";

    var bar = document.createElement("a");
    bar.id = "about";

    var img = document.createElement("img");
    img.src = chrome.extension.getURL("images/nexticon.png");
    img.style.width = "25px";
    img.style.height = "25px";
    img.style.verticalAlign = 'middle';

    bar.appendChild(img);

    // var title = document.createElement("b");
    // title.innerHTML = "Next";
    // title.style.verticalAlign = 'middle';
    // title.style.marginLeft = '10px';
    // bar.appendChild(title);

    bar.onclick = function() {
        chrome.runtime.sendMessage({
            type: "forcenext"
        });
    }

    sidenav.appendChild(bar);
    document.body.appendChild(sidenav);
}

injectSidenav();
// Hide sidenav on fullscreen
document.addEventListener("fullscreenchange", (event) => {
    if (document.fullscreenElement) {
        sidenav.style.display = "none";
    } else if (!document.fullscreenElement) {
        sidenav.style.display = "block";
    }
});

// Add button to div called dismissable
function injectButton(dismissable) {
    var thumbnailoverlay = dismissable.querySelector("ytd-thumbnail");
    if (thumbnailoverlay == null || thumbnailoverlay.querySelector(".addbutton") != null) {
        return 0;
    }
    var thumbnail = dismissable.querySelector("#thumbnail");
    var title = dismissable.querySelector("#video-title");
    var img = document.createElement("img");
    img.src = chrome.extension.getURL("images/plus.png");
    img.style.width = "60%";
    img.style.height = "60%";
    img.style.verticalAlign = 'middle';
    var button = document.createElement("button");
    button.className = "addbutton";
    button.appendChild(img);
    button.onclick = function() {
        button.style.background = '#FF9E9E';
        addNext(title.getAttribute("title").trim(), "https://www.youtube.com" + thumbnail.getAttribute("href"));
    };
    thumbnailoverlay.appendChild(button);
    return 1;
}

document.querySelectorAll("#dismissable").forEach(function(dismissable) {
    injectButton(dismissable);
});

// When the "dismissable" div arrives, inject button
document.arrive("#dismissable", function() {
    injectButton(this);
});