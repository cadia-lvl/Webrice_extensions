const tags = {
    'play': [
            'webricePlayButton',
            'webricePlayIcon',
            'webriceEarIcon',

    ],
    'pause': [
        'webricePauseButton',
        'webricePauseIcon'
    ],
    'stop': [
        'webriceStopButton',
        'webriceStopIcon'
    ],
    'speed': [
        'webriceSpeedButton',
        'webriceSpeedIcon'
    ],
    'settings': [
        'webriceSettingsButton',
        'webriceSettingsIcon'
    ]
};

//hide pause icon in the begining
var PauseIconState = document.getElementById("webricePauseIcon");
PauseIconState.classList.add("hide");
//console.log (" Pause is ",PauseIconState);


var PlayIconState = document.getElementById("webricePlayIcon");

const handleInputResponse = message => { console.log(`*Content script response*`); }
const handleInputResponseError = error => console.error(`Content script response error: ${error}`);

const sendTabMessage = (tabId, message) => {
    browser.tabs.sendMessage(tabId, { cmd: message })
        .then(handleInputResponse, handleInputResponseError);
 }

const handleTabQueryError = error => console.error(`Tab query error: ${error}`);
const controlRouter = action => {
    browser.tabs.query({
        currentWindow: true,
        active: true
    })
        .then(tabs => sendTabMessage(tabs[0].id, action))
        .catch(handleTabQueryError);
}

const VerifyStopState = () => {

    console.log('verified state');
    if (PlayIconState.classList.contains("hide"))
      PlayIconState.classList.replace("hide","appear");

      if (PauseIconState.classList.contains("appear"))
        PauseIconState.classList.replace("appear","hide");
}

const VerifyPlayState = () => {

    console.log('Play verified state');
    //play first time
    PlayIconState.classList.add("appear","hide");
    console.log (" Play second is ",PlayIconState);
    //if it stopped then play from begining
    if (PlayIconState.classList.contains("appear"))
      {PlayIconState.classList.replace("appear","hide");
      console.log (" Play after stop is ",PlayIconState);}

    if (PauseIconState.classList.contains("hide"))
    PauseIconState.classList.add("appear");

}

const listenForClicks = () => {
    document.addEventListener('click', e => {
        const targetId = e.target.id;
        let action = '';

        if      (tags['play'].includes(targetId))       {
          action = 'play';
          console.log (" Play first is ",PlayIconState);
          VerifyPlayState();
          }
        //replace this one by replay

        else if (tags['pause'].includes(targetId))       {
        action = 'pause';
        PlayIconState.classList.toggle("hide");
        PauseIconState.classList.toggle("appear");
        }

        else if (tags['stop'].includes(targetId))       {
        action = 'stop';
        VerifyStopState();
      }

        else if (tags['speed'].includes(targetId))      { action = 'speed'; }
        else if (tags['settings'].includes(targetId))   { action = 'settings'; }

        if(action !== '') {
            controlRouter(action);
            action = '';
        }
    });
}

const reportExecuteScriptError = error => { console.error(error); }
browser.tabs.executeScript({file: 'input_processing.js'})
    .then(listenForClicks)
    .catch(reportExecuteScriptError);
