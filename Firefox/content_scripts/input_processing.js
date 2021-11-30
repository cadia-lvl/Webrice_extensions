(function() {
    if (window.hasRun) { return; }
    window.hasRun = true;

    const msg_types = ['play', 'stop', 'speed', 'settings'];

    const handleApiResponse = response => {
        let audioElem = document.createElement('audio');
        audioElem.src = response;
        audioElem.autoplay = true;
        document.body.appendChild(audioElem);
    }
    const handleRApiesponseError = error => console.error(`Background script response error: ${error}`);

    const playSound = text => {
        browser.runtime.sendMessage({ cmd: 'tts', content: text })
            .then(handleApiResponse, handleRApiesponseError);
    }

    const playButton = () => {
        let userSelectedText = document.getSelection().toString();
        playSound(userSelectedText);
    }

    const stopButton = () => {
        console.log('stahp');
    }

    const speedButton = () => {
        console.log('sped');
    }

    const settingsButton = () => {
        console.log('sendings');
    }

    let handlePlayerInput = cmd => {  
        switch(cmd) {
            case 'play':
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