function removeAll() {
    chrome.storage.local.set({
        'queue': []
    }, function() {});
}

function getTabid() {
    chrome.storage.local.get({
        'tab': []
    }, function(result) {
        tabid = result.tab;
        updateTabTitle();
    });
}

function openLink(url) {
    if (!tabid || tabid == "paused") {
        chrome.runtime.sendMessage({
            type: "openurl",
            newurl: url
        });
    } else {
        chrome.tabs.update(tabid, {
            url: url
        });
    }
}

function addfirstsearch() {
    gapi.client.setApiKey(apiKey);
    gapi.client.load('youtube', 'v3', function() {
        getFirst();
    });
}

function makeRequest(q) {
    var request = gapi.client.youtube.search.list({
        type: "video",
        q: q,
        part: 'snippet',
        maxResults: 4
    });
    request.execute(function(response) {
        var srchItems = response.result.items;
        searchresults.innerHTML = "";
        srchItems.forEach(function(item, index) {
            var vidTitle = item.snippet.title;
            var vidUrl = "https://www.youtube.com/watch?v=" + item.id.videoId;
            var row = document.createElement("p");
            row.className = "searchobj";
            row.innerHTML = vidTitle;
            row.onclick = function() {
                addNext(vidTitle, vidUrl);
            };
            searchresults.appendChild(row);
        });
    })
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
        srchItems.forEach(function(item, index) {
            vidTitle = item.snippet.title;
            vidUrl = "https://www.youtube.com/watch?v=" + item.id.videoId;
            addNext(vidTitle, vidUrl);
            searchbar.value = "";
        });
    })
}