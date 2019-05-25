var cached = [];
cached.push(location.href);
var bottomMenu;

// Get the videoplayer
function attachToVid() {
    var vid = document.querySelector("video");
    if (vid) {
        // Play next when video ends
        vid.onended = function(e) {
            nextMessage();
        }
    }
}
attachToVid();

// Snackbar to notify about "playnexthere"
function injectSnackbar() {
    var snackbar = document.createElement("div");
    snackbar.setAttribute("id", "snackbar");
    document.body.append(snackbar);
}

function showSnackbar(message) {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");
    x.innerHTML = message;

    // Add the "show" class to DIV
    x.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function() { x.className = ""; }, 3000);
}
injectSnackbar();

function herebarSnackbarMessage() {
    var message = "";
    // sendmessage is async
    chrome.runtime.sendMessage({
        type: "check"
    }, function(response) {
        // Decide which screen the user is in and the context
        if (response.response == "selected") {
            message = "Your videos are already queued to this tab";
        } else if (document.location.href.match(/watch/)) {
            message = "Your videos are now queued after this video";
        } else {
            message = "Your videos are now queued to this tab";
        }
        // Show snackbar with appropriate message
        showSnackbar(message);
    });
}

function injectPrimaryAddButton() {
    var video_primary_info = document.querySelector("ytd-menu-renderer.ytd-video-primary-info-renderer");
    var top_level_buttons = video_primary_info.querySelector("div#top-level-buttons");

    var titlediv = document.querySelector("h1.title");
    var title = titlediv.querySelector("yt-formatted-string.ytd-video-primary-info-renderer").innerHTML;

    var img = document.createElement("img");
    img.src = chrome.extension.getURL("images/plus.png");

    var button = document.createElement("button");
    button.className = "addbuttonprimary";
    button.appendChild(img);
    button.onclick = function() {
        button.style.background = '#FF9E9E';
        addNext(title.trim(), document.location.href);
    };

    top_level_buttons.appendChild(button);
}

// Tell the background that the video is done
function nextMessage() {
    chrome.runtime.sendMessage({
        type: "next"
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

// Injects the controls in the bottom
function injectBottomMenu() {
    bottomMenu = document.createElement("div");
    bottomMenu.id = "bottomMenu";

    var nextbar = document.createElement("a");
    nextbar.id = "next";

    var img = document.createElement("img");
    img.src = chrome.extension.getURL("images/nexticon.png");
    nextbar.appendChild(img);

    var herebar = document.createElement("a");
    herebar.id = "here";
    herebar.innerHTML = "Q";
    // Ask background if this tab is selected
    chrome.runtime.sendMessage({
        type: "check"
    }, function(response) {
        if (response.response == "selected") {
            herebar.style.color = 'white';
        }
    });

    var pip = document.createElement("a");
    pip.id = "pip";

    var img = document.createElement("img");
    img.src = chrome.extension.getURL("images/pip.png");
    pip.appendChild(img);

    nextbar.onclick = function() {
        chrome.runtime.sendMessage({
            type: "forcenext"
        });
    }
    pip.onclick = function() {
        var vid = document.querySelector("video");
        if (vid) {
            if (vid !== document.pictureInPictureElement) {
                vid.requestPictureInPicture();
            } else {
                document.exitPictureInPicture();
            }
        }
    }
    herebar.onclick = function() {
        herebarSnackbarMessage();
        chrome.runtime.sendMessage({
            type: "playnexthere"
        });
        attachToVid();
    }

    bottomMenu.appendChild(nextbar);
    bottomMenu.appendChild(herebar);
    bottomMenu.appendChild(pip);
    document.body.appendChild(bottomMenu);
}
injectBottomMenu();

// Add button to div called dismissable
function injectAddButton(dismissable) {
    var thumbnailoverlay = dismissable.querySelector("ytd-thumbnail");
    if (thumbnailoverlay == null || thumbnailoverlay.querySelector(".addbutton") != null) {
        return;
    }
    var thumbnail = dismissable.querySelector("#thumbnail");
    var title = dismissable.querySelector("#video-title");

    var img = document.createElement("img");
    img.src = chrome.extension.getURL("images/plus.png");

    var button = document.createElement("button");
    button.className = "addbutton";
    button.appendChild(img);

    button.onclick = function() {
        button.style.background = '#FF9E9E';
        addNext(title.getAttribute("title").trim(), "https://www.youtube.com" + thumbnail.getAttribute("href"));
    };
    thumbnailoverlay.appendChild(button);
}

// Select all current dismissables
document.querySelectorAll("#dismissable").forEach(function(dismissable) {
    injectAddButton(dismissable);
});

// When the "dismissable" div arrives, inject button
document.arrive("#dismissable", function() {
    injectAddButton(this);
});

// Hide Bottom menu on fullscreen
document.addEventListener("fullscreenchange", (event) => {
    if (document.fullscreenElement) {
        bottomMenu.style.display = "none";
    } else if (!document.fullscreenElement) {
        bottomMenu.style.display = "block";
    }
});

// Broadcast tabid to other scripts
chrome.runtime.sendMessage({
    type: "tabid"
});

// Button which adds the current video to the queue
window.addEventListener("yt-page-data-updated", function() {
    injectPrimaryAddButton();
});

// Attaches to video when user navigates, uses this listener since the content script wont be refreshed each time you click on a new video
window.addEventListener("yt-navigate-finish", function() {
    attachToVid();
});

// Listen to directions from the background script
chrome.runtime.onMessage.addListener(
    function(msg, sender, sendResponse) {
        if (msg.type == "notselected") {
            document.querySelector("a#here").style.color = "black";
        } else if (msg.type == "selected") {
            document.querySelector("a#here").style.color = "white";
        }
    });