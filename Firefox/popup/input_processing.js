
(function() {
    if (window.hasRun) { return; }
    window.hasRun = true;

    const msg_types = ['play','pause', 'stop', 'speed', 'settings', 'replay'];
    let audioElem = null;
    let playstat = false;

  /*  document.documentElement.style.setProperty('--id-icon', 'webricePlayIcon');
    var valueP =  getComputedStyle(document.documentElement).getPropertyValue('--id-icon');

    document.documentElement.style.setProperty('--display-pause', 'none');
    var valueD =  getComputedStyle(document.documentElement).getPropertyValue('--display-pause');
    console.log ("Icon pause 1 is ",valueD);*/


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
      else {audioElem.play();
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
        audioElem.play();


    }

    const settingsButton = () => {
        console.log('sendings');
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
