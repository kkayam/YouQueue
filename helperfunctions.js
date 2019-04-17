function removeAll() {
    chrome.storage.local.set({
        'queue': []
    }, function() {
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

function openLink(url) {
    if (tabid == "none") {
        chrome.tabs.create({
            url: url
        }, function(tab) {
            tabid = tab.id;
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
        $.each(srchItems, function(index, item) {
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
        $.each(srchItems, function(index, item) {
            vidTitle = item.snippet.title;
            vidUrl = "https://www.youtube.com/watch?v=" + item.id.videoId;
            addNext(vidTitle, vidUrl);
            searchbar.value = "";
        });
    })
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