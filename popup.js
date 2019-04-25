var tabid;
// var tabids;
// var tabidsindex;
var tabtitle;
var apiKey = "AIzaSyDFU2ViycjJgbrpgxYQF5aVrnL7l9vQ9Mw";

// Initialize firestore
firebase.initializeApp({
    apiKey: apiKey,
    authDomain: "queue-237008.firebaseapp.com",
    projectId: "youtube-queue-237008"
});

var db = firebase.firestore();

// Reference to messages database
var messagesRef = db.collection("chat").doc("messages");

// Elements in html
var queueText = document.getElementById('queue');
var removeButton = document.getElementById('removeQueue');
var nextButton = document.getElementById('nextQueue');
var searchBar = document.getElementById('searchbar');
searchBar.focus();
var searchresults = document.getElementById('searchresults');
var searchlistarea = document.getElementById("searchlistarea");
var emptytext = document.getElementById("emptytext");
var currenttab = document.getElementById("currenttab");
var currenttabdiv = document.getElementById("currenttabdiv");
var chatbox = document.getElementById("chatbox");
var chatinput = document.getElementById("chatinput");
var username = document.getElementById("username");
var musicbutton = document.getElementById("musicbutton");
var chat = document.getElementById("chat");
var chatbutton = document.getElementById("chatbutton");
var chatbuttonimg = chatbutton.querySelector("img");



window.onload = function() {
    getTabid();
    writeOutQueue();
    // tabids = getYoutubeTabids();
    // tabidsindex = tabids.indexOf(tabid);

    chrome.storage.local.get({
        'username': [],
        'chatdisplay': []
    }, function(result) {
        username.value = result.username;
        chat.style.display = result.chatdisplay;
        if (result.chatdisplay=="block") chatbuttonimg.style.transform = 'rotate(180deg)';
    });
};


function getYoutubeTabids() {
    chrome.tabs.query({ url: "https://www.youtube.com/*" }, function(tabs) {
        if (tabs.length > 0) {
            return tabs.map(x => x.id);
        }
    });
}

function updateTabTitle() {
    chrome.tabs.query({}, function(tabs) {
        tabs.forEach(function(tab) {
            if (tab.id == tabid) {
                currenttabdiv.style.display = 'block'
                var title = tab.title.replace(/ *\(\d{0,2}\+?\) */, "").replace(" - YouTube", "");
                currenttab.innerHTML = title;
                return;
            }
        });
    });
    currenttabdiv.style.display = 'none'
}


function writeOutQueue() {
    queueText.innerHTML = "";
    chrome.storage.local.get({
        'queue': []
    }, function(result) {
        if (result.queue.length == 0) {
            emptytext.style.display = 'initial';
            queue.style.display = 'none';
            return;
        }
        emptytext.style.display = 'none';
        queue.style.display = 'initial';
        result.queue.forEach(function(element, index) {
            var row = document.createElement("tr");
            row.className = "queuerow";
            row.width = '100%';
            row.align = 'middle';
            row.style.alignContent = 'middle';

            var deletebutton = document.createElement("td");
            deletebutton.className = "deletebtn";
            deletebutton.innerHTML = "&#10006;";
            deletebutton.onclick = function() {
                deleteindex(index);
            };

            var videobutton = document.createElement("td");
            videobutton.className = "videobtn";
            videobutton.innerHTML = element[0];
            videobutton.width = '100%';
            videobutton.onclick = function() {
                nextto(index);
            };
            videobutton.onmouseenter = function() {
                deletebutton.style.background = '#7FFF8E';
            }
            videobutton.onmouseleave = function() {
                deletebutton.style.background = 'initial';
            }

            row.appendChild(deletebutton);
            row.appendChild(videobutton);
            queue.appendChild(row);
        });
    });
}

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
        }, function() {});
        openLink(vidurl);
    });
}


function deleteindex(index) {
    chrome.storage.local.get({
        'queue': []
    }, function(result) {
        videoqueue = result.queue;
        videoqueue.splice(index, 1);
        chrome.storage.local.set({
            'queue': videoqueue
        }, function() {});
    });
}


function keyWordsearch(q) {
    if (searchbar.value == "") {
        searchresults.innerHTML = "";
        return;
    } else if (searchbar.value == "credits:") {
        searchresults.innerHTML = "<a>Creator: Koray M Kaya <br> Beta testers: Sabeen and Haris <br><font size=17pt>😊</font></a>"+
        '<div>Icons made by <a href="https://www.freepik.com/" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/"                 title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/"              title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>';
        return;
    }
    gapi.client.setApiKey(apiKey);
    gapi.client.load('youtube', 'v3', function() {
        q = searchbar.value;
        makeRequest(q);
    });
}

// Changes in chat
messagesRef.onSnapshot(function(doc) {
    chatbox.innerHTML = ""
    doc.data().messages.forEach(function(element, index) {
        chatbox.innerHTML += element + "<br>";
    });
    var linklist = chatbox.querySelectorAll("a");
    linklist.forEach(function(element, index) {
        element.onclick = function() {
            openLink(element.getAttribute("url"));
            //addNext(element.innerHTML, element.getAttribute("url"));
        };
    });
});

function sendChat(text) {
    db.runTransaction(function(transaction) {
        return transaction.get(messagesRef).then(function(doc) {
            var newmessages = doc.data().messages;
            newmessages.shift();
            newmessages.push(text);
            transaction.update(messagesRef, {
                messages: newmessages
            });
            return newmessages;
        });
    });
}


// EVENT LISTENERS
musicbutton.onclick = function() {
    var taburl = "";
    chrome.tabs.query({}, function(tabs) {
        tabs.forEach(function(tab) {
            if (tab.id == tabid) {
                taburl = tab.url;
                if (taburl.includes("watch?v=")) {
                    var b = document.createElement("b");
                    b.className = "chatlinkparent";
                    b.innerHTML = username.value + " is listening to " + "<a class='chatlink' url='" + taburl + "'>" + currenttab.innerHTML + "</a>";
                    sendChat(b.outerHTML);
                }
            }
        });
    });
};


chatbutton.onclick = function() {
    if (chat.style.display == 'block') {
        chat.style.display = 'none';
        chatbuttonimg.style.transform = '';
    } else {
        chat.style.display = 'block';
        chatbuttonimg.style.transform = 'rotate(180deg)';
    }
    chrome.storage.local.set({
        'chatdisplay': chat.style.display
    }, function() {});
}


var timeout = null;
searchbar.addEventListener('keydown', function(e) {
    if (e.keyCode == 13) {
        if (searchBar.value == "") {
            next();
        } else {
            addfirstsearch();
        }
    } else if (searchBar.value != "") {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            q = searchBar.value;
            keyWordsearch(q);
        }, 350);
    }
});

removeButton.addEventListener('click', function() {
    removeAll()
});
nextButton.addEventListener('click', function() {
    next()
});

username.addEventListener('focusout', function(e) {
    chrome.storage.local.set({
        'username': username.value
    }, function() {});
});

chatinput.addEventListener('keydown', function(e) {
    if (e.keyCode == 13) {
        sendChat(username.value + ": " + chatinput.value);
        chatinput.value = "";
    }
});


chrome.storage.onChanged.addListener(function(changes, areaName) {
    if (changes.queue) {
        writeOutQueue();
    }
    if (changes.tab) {
        tabid = changes.tab.newValue;
        updateTabTitle();
    }
});


chrome.tabs.onUpdated.addListener(
    function(changedtabid, changeInfo, tab) {
        if (changeInfo.title) {
            if (changedtabid == tabid) {
                updateTabTitle();
            }
        }
    }
);