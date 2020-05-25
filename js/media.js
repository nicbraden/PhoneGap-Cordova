// Wait for device API libraries to load
document.addEventListener("deviceready", onDeviceReady, false);
var dropDownSelected = document.getElementById("musicdropdown").value;

// device APIs are available
function onDeviceReady() {    
    useMedia();
}

let beyonace = '/android_asset/www/song1.mp3';
let arcadeFire = '/android_asset/www/song6.mp3';
let lizzo = '/android_asset/www/song10.mp3';
let nintyAnd00s = '/android_asset/www/song11.mp3';

let selectedPlaylist;

function getSelectedValue() {
    var dropDownSelected = document.getElementById("musicdropdown").value;
    dropDownSelected = document.getElementById("musicdropdown").value;
}
function useMedia() {
    console.log(dropDownSelected);
    console.log(selectedPlaylist);
    var sourceToPlay;

    if (dropDownSelected == 1) {
        selectedPlaylist = beyonace;
    } else if (dropDownSelected == 2) {
        selectedPlaylist = arcadeFire;
    } else if (dropDownSelected == 3) {
        selectedPlaylist = lizzo;
    } else if (dropDownSelected == 4) {
        selectedPlaylist = nintyAnd00s;
    }

    
    if( device.platform === 'Android' ) {
        sourceToPlay = selectedPlaylist;
    } else {
        sourceToPlay = selectedPlaylist;
    }

    var media = new Media( sourceToPlay, null, mediaError, mediaStatus );

    var playButton = document.getElementById("play-media-button");
    playButton.addEventListener("click", playMedia, false);

    var pauseButton = document.getElementById("pause-media-button");
    pauseButton.addEventListener("click", pauseMedia, false);

    var stopButton = document.getElementById("stop-media-button");
    stopButton.addEventListener("click", stopMedia, false);

    function mediaStatus(status) {
        document.getElementById('duration').innerHTML = (Math.floor(media.getDuration() / 60)) + ':' + (Math.floor(media.getDuration() % 60));
                
        if(status === 0){
            document.getElementById('media-status').innerHTML = 'Sorry no media!';
        }
        
        if(status === 1){
            document.getElementById('media-status').innerHTML = 'Loading...';
        }
        
        if(status === 2){
            document.getElementById('media-status').innerHTML = 'Playing...';
        }
        
        if(status === 3){
            document.getElementById('media-status').innerHTML = 'Paused...';
        }
        
        if(status === 4){
            document.getElementById('media-status').innerHTML = 'Stopped!';
        }
    }
    
    function mediaError(error) {
        document.getElementById('media-status').innerHTML = 'There was a problem. Error code '+ error.code ;
    }
    
    function playMedia() {
        media.play();
    }
    
    function pauseMedia() {
        media.pause();
    }
    
    function stopMedia() {
        media.stop();
    }
    
    function increaseVolume() {
        media.setVolume(0.2);
    }
    
    function muteVolume() {
        media.setVolume(0.0);
    }
    
    function restart() {
        media.seekTo(1);
    }
    
}
