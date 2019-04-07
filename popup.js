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
    chrome.tabs.query({
    }, function(tabs) {
        tabs.forEach(function(tab) {
            if (tab.id == tabid) {
                queryTitle(tab);

            }
        });
    });

}

function queryTitle(tab) {
    var videoId = tab.url.slice((tab.url.indexOf("?v=") + 3), (tab.url.indexOf("?v=") + 14));
    var title = "Could not get title";
    $.ajax({
        url: "https://www.googleapis.com/youtube/v3/videos?id=" + videoId + "&key=" + apiKey + "&fields=items(snippet(title))&part=snippet",
        dataType: "jsonp",
        success: function(data) {
            try {
                tabtitle = data.items[0].snippet.title;
                currenttab.innerHTML = tabtitle;
                return title;
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
var apiKey = "AIzaSyBzLH4gRgoGJu2hK9ALogIIvRDs_4v7Fec";

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
            queueText.innerHTML += "<tr><td><a class='deletebutton' index='" + index + "'>&#10006;</a></td> <td align='center'><a class='listobject' index='" + index + "'>" + element[0] + "</a></td></tr>";
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

window.onload = function() {
    writeOutQueue();
};
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