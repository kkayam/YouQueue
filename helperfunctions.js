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