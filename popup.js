var tabid;
var tabtitle;
var apiKey = "AIzaSyDFU2ViycjJgbrpgxYQF5aVrnL7l9vQ9Mw";
var tips = ["You can rearrange your queue by dragging the videos.",
    "Try the tuna sandwich next time you're ordering from subway!",
    "Right click on any Youtube link to add it to your queue!",
    "Gives us a rating on the webstore!", "Admin loves you 😉",
    "Pineapple does not belong on pizza", "You can chat with other users below!",
    "Instantly queue the first search result by pressing Enter.",
    "Share what you're listening to with the music button in the chat!",
    "The trash button trashes your whole queue!",
    "Press Enter with an empty searchbar to play the next video instantly!",
    "The youtube queue shortcut is CTRL+Q!",
    "The youtube queue shortcut is CTRL+Q!",
    "The youtube queue shortcut is CTRL+Q!",
    "The youtube queue shortcut is CTRL+Q!",
    "Click the Q in the bottom menu to queue videos to that tab!",
    "Click the Q in the bottom menu to queue videos to that tab!",
    "Click the Q in the bottom menu to queue videos to that tab!",
    "Click the Q in the bottom menu to queue videos to that tab!",
    "Click the Q in the bottom menu to queue videos to that tab!",
    "Click the Q in the bottom menu to queue videos to that tab!",
    "Click the Q in the bottom menu to queue videos to that tab!",
    "Click the Q in the bottom menu to queue videos to that tab!",
    "Click the Q in the bottom menu to queue videos to that tab!",
    "Click the Q in the bottom menu to queue videos to that tab!",
    "Click the Q in the bottom menu to queue videos to that tab!",
    "Click the Q in the bottom menu to queue videos to that tab!"
];

function getRandomEmoji(){
    var emojis = [
        '😄','😃','😀','😊','☺','😉','😍','😘','😚','😗','😙','😜','😝','😛','😳','😁','😔','😌','😒','😞','😣','😢','😂','😭','😪','😥','😰','😅','😓','😩','😫','😨','😱','😠','😡','😤','😖','😆','😋','😷','😎','😴','😵','😲','😟','😦','😧','😈','👿','😮','😬','😐','😕','😯','😶','😇','😏','😑','👲','👳','👮','👷','💂','👶','👦','👧','👨','👩','👴','👵','👱','👼','👸','😺','😸','😻','😽','😼','🙀','😿','😹','😾','👹','👺','🙈','🙉','🙊','💀','👽','💩','🔥','✨','🌟','💫','💥','💢','💦','💧','💤','💨','👂','👀','👃','👅','👄','👍','👎','👌','👊','✊','✌','👋','✋','👐','👆','👇','👉','👈','🙌','🙏','☝','👏','💪','🚶','🏃','💃','👫','👪','👬','👭','💏','💑','👯','🙆','🙅','💁','🙋','💆','💇','💅','👰','🙎','🙍','🙇','🎩','👑','👒','👟','👞','👡','👠','👢','👕','👔','👚','👗','🎽','👖','👘','👙','💼','👜','👝','👛','👓','🎀','🌂','💄','💛','💙','💜','💚','❤','💔','💗','💓','💕','💖','💞','💘','💌','💋','💍','💎','👤','👥','💬','👣','💭','🐶','🐺','🐱','🐭','🐹','🐰','🐸','🐯','🐨','🐻','🐷','🐽','🐮','🐗','🐵','🐒','🐴','🐑','🐘','🐼','🐧','🐦','🐤','🐥','🐣','🐔','🐍','🐢','🐛','🐝','🐜','🐞','🐌','🐙','🐚','🐠','🐟','🐬','🐳','🐋','🐄','🐏','🐀','🐃','🐅','🐇','🐉','🐎','🐐','🐓','🐕','🐖','🐁','🐂','🐲','🐡','🐊','🐫','🐪','🐆','🐈','🐩','🐾','💐','🌸','🌷','🍀','🌹','🌻','🌺','🍁','🍃','🍂','🌿','🌾','🍄','🌵','🌴','🌲','🌳','🌰','🌱','🌼','🌐','🌞','🌝','🌚','🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘','🌜','🌛','🌙','🌍','🌎','🌏','🌋','🌌','🌠','⭐','☀','⛅','☁','⚡','☔','❄','⛄','🌀','🌁','🌈','🌊','🎍','💝','🎎','🎒','🎓','🎏','🎆','🎇','🎐','🎑','🎃','👻','🎅','🎄','🎁','🎋','🎉','🎊','🎈','🎌','🔮','🎥','📷','📹','📼','💿','📀','💽','💾','💻','📱','☎','📞','📟','📠','📡','📺','📻','🔊','🔉','🔈','🔇','🔔','🔕','📢','📣','⏳','⌛','⏰','⌚','🔓','🔒','🔏','🔐','🔑','🔎','💡','🔦','🔆','🔅','🔌','🔋','🔍','🛁','🛀','🚿','🚽','🔧','🔩','🔨','🚪','🚬','💣','🔫','🔪','💊','💉','💰','💴','💵','💷','💶','💳','💸','📲','📧','📥','📤','✉','📩','📨','📯','📫','📪','📬','📭','📮','📦','📝','📄','📃','📑','📊','📈','📉','📜','📋','📅','📆','📇','📁','📂','✂','📌','📎','✒','✏','📏','📐','📕','📗','📘','📙','📓','📔','📒','📚','📖','🔖','📛','🔬','🔭','📰','🎨','🎬','🎤','🎧','🎼','🎵','🎶','🎹','🎻','🎺','🎷','🎸','👾','🎮','🃏','🎴','🀄','🎲','🎯','🏈','🏀','⚽','⚾','🎾','🎱','🏉','🎳','⛳','🚵','🚴','🏁','🏇','🏆','🎿','🏂','🏊','🏄','🎣','☕','🍵','🍶','🍼','🍺','🍻','🍸','🍹','🍷','🍴','🍕','🍔','🍟','🍗','🍖','🍝','🍛','🍤','🍱','🍣','🍥','🍙','🍘','🍚','🍜','🍲','🍢','🍡','🍳','🍞','🍩','🍮','🍦','🍨','🍧','🎂','🍰','🍪','🍫','🍬','🍭','🍯','🍎','🍏','🍊','🍋','🍒','🍇','🍉','🍓','🍑','🍈','🍌','🍐','🍍','🍠','🍆','🍅','🌽','🏠','🏡','🏫','🏢','🏣','🏥','🏦','🏪','🏩','🏨','💒','⛪','🏬','🏤','🌇','🌆','🏯','🏰','⛺','🏭','🗼','🗾','🗻','🌄','🌅','🌃','🗽','🌉','🎠','🎡','⛲','🎢','🚢','⛵','🚤','🚣','⚓','🚀','✈','💺','🚁','🚂','🚊','🚉','🚞','🚆','🚄','🚅','🚈','🚇','🚝','🚋','🚃','🚎','🚌','🚍','🚙','🚘','🚗','🚕','🚖','🚛','🚚','🚨','🚓','🚔','🚒','🚑','🚐','🚲','🚡','🚟','🚠','🚜','💈','🚏','🎫','🚦','🚥','⚠','🚧','🔰','⛽','🏮','🎰','♨','🗿','🎪','🎭','📍','🚩','♠','♥','♣','♦','💮','💯','✔','☑','🔘','🔗','➰','🔱','🔲','🔳','◼','◻','◾','◽','▪','▫','🔺','⬜','⬛','⚫','⚪','🔴','🔵','🔻','🔶','🔷','🔸','🔹'
    ];    
    return emojis[Math.floor(Math.random() * emojis.length)];
}

// Initialize firestore
firebase.initializeApp({
    apiKey: apiKey,
    authDomain: "queue-237008.firebaseapp.com",
    projectId: "youtube-queue-237008"
});

firebase.auth().signInAnonymously().catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
});

var db = firebase.firestore();

// Reference to messages database
var messagesRef = db.collection("chat").doc("messages");

// Elements in html
var queue = document.getElementById('queue');
var removeButton = document.getElementById('removeQueue');
var nextButton = document.getElementById('nextQueue');
var playpause = document.getElementById('playpause');
var searchBar = document.getElementById('searchbar');
searchBar.focus();
var searchresults = document.getElementById('searchresults');
var searchlistarea = document.getElementById("searchlistarea");
var emptytext = document.getElementById("emptytext");
var tip = emptytext.getElementsByTagName('tip')[0];
var currenttab = document.getElementById("currenttab");
var currenttabdiv = document.getElementById("currenttabdiv");
var chatbox = document.getElementById("chatbox");
var chatboxholder = document.getElementById("chatboxholder");
var chatinput = document.getElementById("chatinput");
var username = document.getElementById("username");
var musicbutton = document.getElementById("musicbutton");
var chat = document.getElementById("chat");
var chatbutton = document.getElementById("chatbutton");
var donationbutton = document.getElementById("donationbutton");
var chatbuttonimg = chatbutton.getElementsByTagName("img")[0];

var playing = true;

sortable('.queue', {
    forcePlaceholderSize: true
})[0].addEventListener('sortupdate', function(e) {
    chrome.storage.local.get({
        'queue': []
    }, function(result) {
        var videoqueue = result.queue;
        var item = videoqueue.splice(e.detail.origin.index, 1);
        videoqueue.splice(e.detail.destination.index, 0, item[0]);
        chrome.storage.local.set({
            'queue': videoqueue
        }, function() {});
    });
});;

window.onload = function() {
    getTabid();
    writeOutQueue();
    chrome.storage.local.get({
        'username': [],
        'chatdisplay': [],
        'playing': []
    }, function(result) {
        if (!result.username) {
            username.value = getRandomEmoji();
            chrome.storage.local.set({
                'username': username.value
            }, function() {});
        }
        else {username.value = result.username;}
        chat.style.display = result.chatdisplay;
        if (result.chatdisplay == "block") chatbuttonimg.style.transform = 'rotate(180deg)';
        if (!result.playing) {playpause.src="images/play.png";}
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
    if (tabid == "paused") {
        currenttabdiv.style.display = 'block';
        currenttab.innerHTML = "Paused";
        return;
    }
    chrome.tabs.query({}, function(tabs) {
        tabs.forEach(function(tab) {
            if (tab.id == tabid) {
                currenttabdiv.style.display = 'block';
                var title = tab.title.replace(/ *\(\d{0,2}\+?\) */, "").replace(" - YouTube", "");
                currenttab.innerHTML = title;
                return;
            }
        });
    });
    currenttabdiv.style.display = 'none'
}


function writeOutQueue() {
    queue.innerHTML = "";
    chrome.storage.local.get({
        'queue': []
    }, function(result) {
        if (result.queue.length == 0) {
            tip.innerHTML = tips[Math.floor(Math.random() * tips.length)];
            emptytext.style.display = 'flex';
            queue.style.display = 'none';
            return;
        }
        emptytext.style.display = 'none';
        queue.style.display = 'initial';
        result.queue.forEach(function(element, index) {
            var row = document.createElement("li");
            row.className = "queuerow";
            row.width = '100%';
            row.align = 'middle';
            row.draggable = "true";
            row.style.alignContent = 'middle';

            var deletebutton = document.createElement("btn");
            deletebutton.className = "deletebtn";
            deletebutton.innerHTML = "&#10006;";
            deletebutton.onclick = function() {
                deleteindex(index);
            };

            var videobutton = document.createElement("btn");
            videobutton.className = "videobtn";
            videobutton.innerHTML = element[0];
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
        if (result.queue.length > index) {
            videoqueue = result.queue;
            var vidurl = videoqueue[index][1];
            videoqueue.splice(index, 1);
            chrome.storage.local.set({
                'queue': videoqueue
            }, function() {});
            openLink(vidurl);
        }
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
        searchresults.innerHTML = "<a>Creator: Koray M Kaya <br> Beta testers: Sabeen and Haris <br><font size=17pt>😊</font></a>" +
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
        };
    });
    chatboxholder.scrollTo(0,10000000000);
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
                    musicbutton.disabled = true;
                    timeout = setTimeout(function() {
                        musicbutton.disabled = false;
                    }, 2000);
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
        chatboxholder.scrollTo(0,10000000000);
    }
    chrome.storage.local.set({
        'chatdisplay': chat.style.display
    }, function() {});
}

playpause.onclick = function() {
    chrome.storage.local.get({
        'playing': []
    }, function(result) {
        if (result.playing) {
            chrome.tabs.sendMessage(tabid, { type: "pause" });
        } else {
            chrome.tabs.sendMessage(tabid, { type: "play" });
        }
    });
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
        }, 700);
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
    if (changes.playing) {
        if (changes.playing.newValue) {
            playpause.src = "images/pause.png";
        } else {
            playpause.src = "images/play.png";
        }
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

currenttabdiv.onclick = function() {
    if (tabid == "paused") { return }
    chrome.tabs.update(tabid, { 'active': true }, function() {});
    chrome.tabs.get(tabid, function(tab) {
        chrome.windows.update(tab.windowId, { 'focused': true });
    });
}

donationbutton.onclick = function() {
    chrome.runtime.sendMessage({
            type: "openurl",
            newurl: "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=4ZVT654MY78XQ&source=url"
        });
}