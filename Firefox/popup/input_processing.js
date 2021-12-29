
(function() {
    if (window.hasRun) { return; }
    window.hasRun = true;

    const msg_types = ['play','pause', 'stop', 'speed', 'settings', 'replay'];
    let audioElem = null;
    let playstat = false;

  /*  document.documentElement.style.setProperty('--id-icon', 'webricePlayIcon');
    var valueP =  getComputedStyle(document.documentElement).getPropertyValue('--id-icon');
    console.log ("Value P 1 is ",valueP);

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
        console.log ("Value P 2 is ",valueP);

    }





    const handleRApiesponseError = error => console.error(`Background script response error: ${error}`);

    const playSound = text => {
        browser.runtime.sendMessage({ cmd: 'tts', content: text })
            .then(handleApiResponse, handleRApiesponseError);

    }

    const playButton = () => {
        let userSelectedText = document.getSelection().toString();
        console.log(userSelectedText);
        playSound(userSelectedText);

    }

    const stopButton = () => {
      //get audio by id using document.get
        audioElem.pause();
        //audioElem.currentTime=0;
        //console.log("current time ",audioElem.currentTime);
        console.log('stahp');

        document.documentElement.style.setProperty('--id-icon', 'webricePlayIcon');
        valueP = getComputedStyle(document.documentElement).getPropertyValue('--id-icon');
        console.log ("Value P 3 is ",valueP);
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
                playButton();
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
