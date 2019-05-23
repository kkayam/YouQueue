var cached = [];
cached.push(location.href);
var bottomMenu;

// Get the videoplayer
function attachToVid() {
    var vid = document.querySelectorAll(".video-stream");
    if (vid.length > 0) {
        // Play next when video ends
        vid[0].onended = function(e) {
            nextMessage()
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
function showSnackbar() {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");

    if (document.location.href.match(/watch/)) {
        x.innerHTML = "Your videos are now queued after this video";
    } else {
        x.innerHTML = "Your videos are now queued to this tab";
    }

    chrome.runtime.sendMessage({
        type: "check"
    }, function(response) {
        if (response.response == "selected") {
            x.innerHTML = "Your videos are already queued to this tab";
        }
    });

    // Add the "show" class to DIV
    x.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function() { x.className = ""; }, 3000);
}
injectSnackbar();

function injectPrimaryAddButton() {
    var video_primary_info = document.querySelector("ytd-menu-renderer.ytd-video-primary-info-renderer");
    var top_level_buttons = video_primary_info.querySelector("div#top-level-buttons");

    var titlediv = document.querySelector("h1.title");
    var title = titlediv.querySelector("yt-formatted-string.ytd-video-primary-info-renderer").innerHTML;

    var img = document.createElement("img");
    img.src = chrome.extension.getURL("images/plus.png");
    img.style.width = "60%";
    img.style.height = "60%";
    img.style.verticalAlign = 'middle';
    var button = document.createElement("button");
    button.className = "addbuttonprimary";
    button.appendChild(img);
    button.onclick = function() {
        button.style.background = '#FF9E9E';
        console.log(document.location);
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
    img.style.width = "25px";
    img.style.height = "25px";
    img.style.verticalAlign = 'middle';
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

    nextbar.onclick = function() {
        chrome.runtime.sendMessage({
            type: "forcenext"
        });
    }
    herebar.onclick = function() {
        showSnackbar();
        chrome.runtime.sendMessage({
            type: "playnexthere"
        });
        attachToVid();
    }

    bottomMenu.appendChild(nextbar);
    bottomMenu.appendChild(herebar);
    document.body.appendChild(bottomMenu);
}
injectBottomMenu();

// Add button to div called dismissable
function injectAddButton(dismissable) {
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

window.addEventListener("yt-page-data-updated", function() {
    injectPrimaryAddButton();
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