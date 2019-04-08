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
        updateTabTitle();
    });
}

function updateTabTitle() {
    chrome.tabs.query({}, function(tabs) {
        tabs.forEach(function(tab) {
            if (tab.id == tabid) {
                queryTitle(tab);
                return;
            }
        });
    });
    currenttabdiv.style.display = 'none'
}

function queryTitle(tab) {
    var videoId = tab.url.slice((tab.url.indexOf("?v=") + 3), (tab.url.indexOf("?v=") + 14));
    $.ajax({
        url: "https://www.googleapis.com/youtube/v3/videos?id=" + videoId + "&key=" + apiKey + "&fields=items(snippet(title))&part=snippet",
        dataType: "jsonp",
        success: function(data) {
            currenttabdiv.style.display = 'block'
            try {
                tabtitle = data.items[0].snippet.title;
                currenttab.innerHTML = tabtitle;
                return;
            } catch (error) {
                tabtitle = tab.title;
                currenttab.innerHTML = tabtitle;
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert(textStatus);
        }
    });
}
var tabid;
var tabtitle;
var apiKey = "AIzaSyDFU2ViycjJgbrpgxYQF5aVrnL7l9vQ9Mw";


firebase.initializeApp({
    apiKey: apiKey,
    authDomain: "queue-237008.firebaseapp.com",
    projectId: "youtube-queue-237008"
});

var db = firebase.firestore();


function writeOutQueue() {
    emptytext.innerHTML = "";
    getTabid();
    queueText.innerHTML = "";
    chrome.storage.local.get({
        'queue': []
    }, function(result) {
        if (result.queue.length == 0) {
            emptytext.innerHTML = "<h2 class='empty'>😓Empty😓</h2>"
            return;
        }
        result.queue.forEach(function(element, index) {
            queueText.innerHTML += "<tr><td width = '25px'><a class='deletebutton' align='center' index='" + index + "'>&#10006;</a></td><td width='4px'></td> <td><a class='listobject' align='center' index='" + index + "'>" + element[0] + "</a></td></tr>";
        });
        var queuelist = document.querySelectorAll(".listobject");
        queuelist.forEach(function(element, index) {
            element.onclick = function() {
                nextto(index);
            };
        });
        var deletebuttons = document.querySelectorAll(".deletebutton");
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
        if (tabid == "none") {
            chrome.tabs.create({
                url: vidurl
            }, function(tab) {
                tabid = tab.id;
            });
        } else {
            chrome.tabs.update(tabid, {
                url: vidurl
            });
        }
    });
}
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

window.onload = function() {
    writeOutQueue();
    chrome.storage.local.get({
        'username': []
    }, function(result) {
        username.value = result.username;
    });
};

var messagesRef = db.collection("chat").doc("messages");

messagesRef.onSnapshot(function(doc) {
    chatbox.innerHTML = ""
    doc.data().messages.forEach(function(element, index) {
        chatbox.innerHTML += element + "<br>";
    });
    var linklist = document.querySelectorAll("a");
    linklist.forEach(function(element, index) {
        element.onclick = function() {
            console.log(element.getAttribute("url"));
            chrome.tabs.update(tabid, {
                url: element.getAttribute("url")
            });
            //addNext(element.innerHTML, element.getAttribute("url"));
        };
    });
});


chrome.tabs.onUpdated.addListener(function(updatedtabid, changeinfo, updatedtab) {
    if (updatedtabid == tabid && changeinfo.url != null) {
        writeOutQueue();
    }
});

function keyWordsearch(e) {
    if (searchbar.value == "") {
        searchresults.innerHTML = "";
        return;
    } else if (searchbar.value == "credits:") {
        searchresults.innerHTML = "<a>Creator: Koray M Kaya <br> Beta testers: Sabeen and Haris <br><font size=17pt>😊</font></a>";
        return;
    }
    gapi.client.setApiKey(apiKey);
    gapi.client.load('youtube', 'v3', function() {
        makeRequest(e);
    });
}

function makeRequest() {
    var q = searchbar.value;
    var request = gapi.client.youtube.search.list({
        type: "video",
        q: q,
        part: 'snippet',
        maxResults: 4
    });
    request.execute(function(response) {
        var srchItems = response.result.items;
        var vidurls = [];
        var vidtitles = [];
        searchresults.innerHTML = "";
        $.each(srchItems, function(index, item) {
            vidTitle = item.snippet.title;
            vidtitles.push(vidTitle);
            vidUrl = "https://www.youtube.com/watch?v=" + item.id.videoId;
            vidurls.push(vidUrl);
            searchresults.innerHTML += "<a class='searchelement'>" + vidTitle + "</a>";
        });
        var searchlist = document.querySelectorAll(".searchelement");
        searchlist.forEach(function(element, index) {
            element.onclick = function() {
                addNext(vidtitles[index], vidurls[index]);
            };
        });
    })
}

function addfirstsearch() {
    gapi.client.setApiKey(apiKey);
    gapi.client.load('youtube', 'v3', function() {
        getFirst();
    });
}

function getFirst() {
    var q = searchbar.value;
    var request = gapi.client.youtube.search.list({
        type: "video",
        q: q,
        part: 'snippet',
        maxResults: 1
    });
    request.execute(function(response) {
        var srchItems = response.result.items;
        searchresults.innerHTML = "";
        $.each(srchItems, function(index, item) {
            vidTitle = item.snippet.title;
            vidUrl = "https://www.youtube.com/watch?v=" + item.id.videoId;
            addNext(vidTitle, vidUrl);
            searchbar.value = "";
        });
    })
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
            keyWordsearch(e);
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
musicbutton.onclick = function() {
    var taburl = "";
    chrome.tabs.query({}, function(tabs) {
        tabs.forEach(function(tab) {
            if (tab.id == tabid) {
                taburl = tab.url;
                sendChat("<b>" + username.value + " is listening to <a class='chatlink' url='" + taburl + "'>" + currenttab.innerHTML + "</a></b>");
            }
        });
    });
};

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

chatinput.addEventListener('keydown', function(e) {
    if (e.keyCode == 13) {
        sendChat(username.value + ": " + chatinput.value);
        chatinput.value = "";
    }
});