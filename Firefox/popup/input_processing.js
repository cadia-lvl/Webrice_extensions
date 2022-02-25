
(function() {
    if (window.hasRun) { return; }
    window.hasRun = true;

    const msg_types = ['play','pause', 'stop', 'speed', 'settings', 'replay'];
    let audioElem = null;
    let playstat = false;
    let speedvar = 3.0;




    const handleApiResponse = response => {
        audioElem = document.createElement('audio');
        audioElem.src = response;
        audioElem.autoplay = true;
        document.body.appendChild(audioElem);
        playstat = true;

        document.documentElement.style.setProperty('--id-icon', 'webricePauseIcon');
        valueP = getComputedStyle(document.documentElement).getPropertyValue('--id-icon');

    }


    const handleRApiesponseError = error => console.error(`Background script response error: ${error}`);

    const playSound = text => {
      if (audioElem == null) {
        browser.runtime.sendMessage({ cmd: 'tts', content: text })
            .then(handleApiResponse, handleRApiesponseError);}
      else {
        //this function controlls the speed 
        audioElem.playbackRate = speedvar;
        console.log ("speed is ",audioElem.playbackRate);
        audioElem.play();
        console.log("playing from last stop"); }

    }

    const playButton = () => {
        let userSelectedText = document.getSelection().toString();
        console.log(userSelectedText);
        playSound(userSelectedText);


    }

    const pauseButton = () => {
        audioElem.pause();
        console.log("audio paused");
    }

    const stopButton = () => {
        audioElem.currentTime=0;
        audioElem.pause();
        console.log('stahp');

    }

    const speedButton = () => {
        console.log('sped');

        audioElem.playbackRate = 3.0;
        audioElem.play();
    }

    const settingsButton = () => {
        console.log('settings');

    }



    let handlePlayerInput = cmd => {
        switch(cmd) {
            case 'play':
                playButton();
                break;
            case 'pause':
                pauseButton();
                break;
            case 'stop':
                stopButton();
                break;
            case 'speed':
                speedButton();
                break;
            case 'settings':
                settingsButton();
                break;
            default:
                console.warn('Unknown command!');
        }
    };

    browser.runtime.onMessage.addListener(message => {
        if(msg_types.includes(message.cmd)) {
            handlePlayerInput(message.cmd);
            // respond({response: `We are content and hear you loud and clear. You just said ${message.cmd}.`});
        }
        else { return false; }
    });
})();
