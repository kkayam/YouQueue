var tabid;
var tabtitle;
var apiKey = "AIzaSyBHV54SnT1YGS_C_ikh2SwFtnOJAOqk5l8";

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


window.onload = function() {
    writeOutQueue();

    chrome.storage.local.get({
        'username': [],
        'chatdisplay': []
    }, function(result) {
        username.value = result.username;
        chat.style.display = result.chatdisplay;
    });
};


function updateTabTitle() {
    chrome.tabs.query({}, function(tabs) {
        tabs.forEach(function(tab) {
            if (tab.id == tabid) {
                // The function below gets the tab title and writes it under "Now Playing"
                queryTitle(tab);
                return;
            }
        });
    });
    currenttabdiv.style.display = 'none'
}

function writeOutQueue() {
    queue.style.display = 'none';
    emptytext.style.display = 'none';
    getTabid();
    queueText.innerHTML = "";
    chrome.storage.local.get({
        'queue': []
    }, function(result) {
        if (result.queue.length == 0) {
            emptytext.style.display = 'block';
            return;
        }
        queue.style.display = 'block';
        result.queue.forEach(function(element, index) {
            queueText.innerHTML += "<tr><td width = '25px'><a class='deletebutton' align='center' index='" + index + "'>&#10006;</a></td><td width='4px'></td> <td><a class='listobject' align='center' index='" + index + "'>" + element[0] + "</a></td></tr>";
        });
        var queuelist = queueText.querySelectorAll(".listobject");
        queuelist.forEach(function(element, index) {
            element.onclick = function() {
                nextto(index);
            };
        });
        var deletebuttons = queueText.querySelectorAll(".deletebutton");
        deletebuttons.forEach(function(element, index) {
            element.onclick = function() {
                deleteindex(index);
            };
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
        }, function() {
            writeOutQueue();
        });
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
        }, function() {
            writeOutQueue();
        });
    });
}


function keyWordsearch(q) {
    if (searchbar.value == "") {
        searchresults.innerHTML = "";
        return;
    } else if (searchbar.value == "credits:") {
        searchresults.innerHTML = "<a>Creator: Koray M Kaya <br> Beta testers: Sabeen and Haris <br><font size=17pt>😊</font></a>";
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
                    sendChat("<b>" + username.value + " is listening to <a class='chatlink' url='" + taburl + "'>" + currenttab.innerHTML + "</a></b>");
                }

            }
        });
    });
};


chatbutton.onclick = function() {
    if (chat.style.display == 'block') {
        chat.style.display = 'none';
        chrome.storage.local.set({
            'chat': false
        }, function() {});
    } else {
        chat.style.display = 'block';
    }

    chrome.storage.local.set({
        'chatdisplay': chat.style.display
    }, function() {});
}

chrome.tabs.onUpdated.addListener(function(updatedtabid, changeinfo, updatedtab) {
    if (updatedtabid == tabid && changeinfo.url != null) {
        writeOutQueue();
    }
});

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

username.addEventListener('keydown', function(e) {
    if (e.keyCode == 13) {
        chrome.storage.local.set({
            'username': username.value
        }, function() {});
    }
});

chatinput.addEventListener('keydown', function(e) {
    if (e.keyCode == 13) {
        sendChat(username.value + ": " + chatinput.value);
        chatinput.value = "";
    }
});