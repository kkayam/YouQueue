var vid = document.getElementsByClassName('video-stream')[0];

chrome.runtime.sendMessage({
    type: "tabid"
});

function next() {
    var videoqueue;
    chrome.storage.local.get({
        'queue': []
    }, function(result) {
        videoqueue = result.queue;
        var vidurl = videoqueue[0][1];
        videoqueue.shift();
        chrome.storage.local.set({
            'queue': videoqueue
        }, function() {});
        window.location.href = vidurl;
    });
}

vid.onended = function(e) {
    next()
}

function insertAddToQueueOptionOnVideos(){
    if(currentQueue==undefined){
        //console.log('undefined currentQueue');
        getCurrentQueue();
        setTimeout(insertAddToQueueOptionOnVideos,Prop.ADD_TO_QUEUE_INSERT_POLL_TIME);
        return;
    }
    
    insertAddToQueueOption();
    var items = document.getElementsByClassName('video-list-item');
    for(var i=0;i<items.length; i++){
        try{
            var item = items[i];
            var q = item.getElementsByClassName('addto-queue-button')[0];
            if(q==undefined || q==null){
                
                var span=item.getElementsByClassName('yt-uix-simple-thumb-wrap')[0]; 
                var but=item.getElementsByTagName('button')[0]; 
                q=but.cloneNode();
                q.classList.remove('addto-watch-later-button');
                q.classList.add('addto-queue-button');
                q.style.marginBottom="22px";
                q.style.padding="0px";
                q.style.width="22px";
                q.style.height="22px";
                q.innerHTML='<img width="20px" height="20px" src=""></img>';
                q.setAttribute('status',getVideoStatus(q.getAttribute('data-video-ids')));

                if(q.getAttribute('status')==videoStatus.QUEUED){
                    q.getElementsByTagName('img')[0].src=Prop.REMOVE_FROM_QUEUE_ICON_URL;
                    q.title=Prop.REMOVE_FROM_QUEUE_TITLE;
                    q.setAttribute('data-tooltip-text',Prop.REMOVE_FROM_QUEUE_TITLE);
                } else{
                    q.getElementsByTagName('img')[0].src=Prop.ADD_TO_QUEUE_ICON_URL;
                    q.title=Prop.ADD_TO_QUEUE_TITLE;
                    q.setAttribute('data-tooltip-text',Prop.ADD_TO_QUEUE_TITLE);
                }

            }

            if(q.getAttribute('status')==videoStatus.ADDING && getVideoStatus(q.getAttribute('data-video-ids'))!=videoStatus.QUEUED){
                continue;
            } else if(q.getAttribute('status')==videoStatus.REMOVING && getVideoStatus(q.getAttribute('data-video-ids'))!=videoStatus.NOT_QUEUED){
                continue;
            }

            if(getVideoStatus(q.getAttribute('data-video-ids'))==videoStatus.QUEUED && q.getAttribute('status')!=videoStatus.QUEUED){
                q.getElementsByTagName('img')[0].src=Prop.REMOVE_FROM_QUEUE_ICON_URL;
                q.title=Prop.REMOVE_FROM_QUEUE_TITLE;
                q.setAttribute('data-tooltip-text',Prop.REMOVE_FROM_QUEUE_TITLE);
                q.setAttribute('status',videoStatus.QUEUED);
            } else if(getVideoStatus(q.getAttribute('data-video-ids'))==videoStatus.NOT_QUEUED && q.getAttribute('status')!=videoStatus.NOT_QUEUED){
                q.getElementsByTagName('img')[0].src=Prop.ADD_TO_QUEUE_ICON_URL;
                q.title=Prop.ADD_TO_QUEUE_TITLE;
                q.setAttribute('data-tooltip-text',Prop.ADD_TO_QUEUE_TITLE);
                q.setAttribute('status',videoStatus.NOT_QUEUED);
            }
                    
            q.onclick=function(){
                console.log('video to be added/removed: '+this.getAttribute('data-video-ids'));

                if(this.getAttribute('status')==videoStatus.ADDING || this.getAttribute('status')==videoStatus.REMOVING)
                    return;

                if(this.getAttribute('status')==videoStatus.QUEUED){
                    removeVideoFromQueue(this.getAttribute('data-video-ids'));
                    this.title=Prop.REMOVING_FROM_QUEUE;
                    this.setAttribute('data-tooltip-text',Prop.REMOVING_FROM_QUEUE);
                    this.setAttribute('status',videoStatus.REMOVING);
                } else {
                    if(currentQueue.size()==0) {
                        load(true);
                        addVideoToQueue(getVideoIdFromUrl());
                    }
                    addVideoToQueue(this.getAttribute('data-video-ids'));
                    this.title=Prop.ADDING_TO_QUEUE;
                    this.setAttribute('data-tooltip-text',Prop.ADDING_TO_QUEUE);
                    this.setAttribute('status',videoStatus.ADDING);
                }
                this.innerHTML='<img  width="20px" height="20px" src="'+Prop.PROGRESS_ICON_URL+'"></img>';
                return false;
            }
            span.appendChild(q);
        } catch(e){
            //console.log(e);
        }
    }
    setTimeout(insertAddToQueueOptionOnVideos,Prop.ADD_TO_QUEUE_INSERT_POLL_TIME);
}


function insertAddToQueueOption(){
    try{
        
        var span=document.getElementById('addToQueue');
        if(span==undefined){
            span = document.createElement('span');
            span.id='addToQueue';
            span.style="margin-left:10px; cursor:pointer;";
            span.className="yt-uix-button yt-uix-button-text yt-uix-button-size-default yt-uix-button-has-icon yt-uix-tooltip yt-uix-button-empty";
            span.innerHTML = '<span class="yt-uix-button-icon" style="width: 20px; height: 20px; margin-right: 3px; "><label style="position: absolute; bottom: 2px; right: 0px; font-size: 11px; display: none;"></label><img id="queue-icon" style="width: 20px; height: 23px;" src=""></img></span>';
            var span2 = document.createElement('span');
            span2.id='addToQueueText';
            span.appendChild(span2);    
            var a = document.getElementById('watch7-sentiment-actions'); //TODO what if they change this
            if(a==undefined) return;
            a.appendChild(span);
            var id = getVideoIdFromUrl();
            var status = getVideoStatus(id);
            span.setAttribute('status',status);
            span.setAttribute('data-video-ids',id);
            if(status==videoStatus.QUEUED){
                span2.innerHTML=Prop.REMOVE_FROM_QUEUE;
                document.getElementById('queue-icon').src=Prop.REMOVE_FROM_QUEUE_ICON_URL;
            } else{
                span2.innerHTML=Prop.ADD_TO_QUEUE;
                document.getElementById('queue-icon').src=Prop.ADD_TO_QUEUE_ICON_URL;
            }
        }

        var span2 = document.getElementById('addToQueueText');
        var queueIcon = document.getElementById('queue-icon');

        if(span.getAttribute('status')==videoStatus.ADDING && getVideoStatus(span.getAttribute('data-video-ids'))!=videoStatus.QUEUED){
            return;
        } else if(span.getAttribute('status')==videoStatus.REMOVING && getVideoStatus(span.getAttribute('data-video-ids'))!=videoStatus.NOT_QUEUED){
            return;
        }

        if(getVideoStatus(span.getAttribute('data-video-ids'))==videoStatus.QUEUED && span.getAttribute('status')!=videoStatus.QUEUED){
            span2.innerHTML=Prop.REMOVE_FROM_QUEUE;
            if(queueIcon!=undefined) queueIcon.src=Prop.REMOVE_FROM_QUEUE_ICON_URL;
            span.setAttribute('status',videoStatus.QUEUED);
        } else if(getVideoStatus(span.getAttribute('data-video-ids'))==videoStatus.NOT_QUEUED && span.getAttribute('status')!=videoStatus.NOT_QUEUED){
            span2.innerHTML=Prop.ADD_TO_QUEUE;
            if(queueIcon!=undefined) queueIcon.src=Prop.ADD_TO_QUEUE_ICON_URL;
            span.setAttribute('status',videoStatus.NOT_QUEUED);
        }

        registerAddQueueListener();
    } catch(e){
        //console.log(e);
    }       
}