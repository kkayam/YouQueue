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
    });
}

var tabid;
var apiKey = "AIzaSyBzLH4gRgoGJu2hK9ALogIIvRDs_4v7Fec";

function writeOutQueue() {
    getTabid();
    queueText.innerHTML = "";
    chrome.storage.local.get({
        'queue': []
    }, function(result) {
        if (result.queue.length == 0) {
            queueText.innerHTML = "<h2 class='empty'>😓Empty😓</h2>"
            return;
        }
        result.queue.forEach(function(element, index) {
            queueText.innerHTML += "<a class='listobject' index='" + index + "'>" + element[0] + "</a>";
        });
        var queuelist = document.querySelectorAll(".listobject");
        queuelist.forEach(function(element, index) {
            element.onclick = function() {
                nextto(index);
            };
        });
    })
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
    })
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
        chrome.tabs.update(tabid, {
            url: vidurl
        });
    });
}

var queueText = document.getElementById('queue');
var removeButton = document.getElementById('removeQueue');
var nextButton = document.getElementById('nextQueue');
var searchBar = document.getElementById('searchbar');
var searchresults = document.getElementById('searchresults');

window.onload = function() {
    writeOutQueue();
};

chrome.tabs.onUpdated.addListener(function(updatedtabid, changeinfo, updatedtab) {
    if (updatedtabid == tabid && changeinfo.url != null) {
        writeOutQueue();
    }
});

function keyWordsearch() {
    gapi.client.setApiKey(apiKey);
    gapi.client.load('youtube', 'v3', function() {
        makeRequest();
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
        $('#results').empty()
        var srchItems = response.result.items;
        searchresults.innerHTML = "";
        $.each(srchItems, function(index, item) {
            vidTitle = item.snippet.title;
            vidUrl = "https://www.youtube.com/watch?v="+item.id.videoId;
            searchresults.innerHTML += "<a class='searchelement' url='"+vidUrl+"'>" + vidTitle + "</a>";
        })
    })
    var searchlist = document.querySelectorAll(".searchelement");
    searchlist.forEach(function(element, index) {
            element.onclick = function() {
                addNext(element.innerHTML,element.getAttribute("url"));
                writeOutQueue();
            };
        });
}

searchbar.addEventListener('keydown', function(e) {
    keyWordsearch();
});
removeButton.addEventListener('click', function() {
    removeAll()
});
nextButton.addEventListener('click', function() {
    next()
});