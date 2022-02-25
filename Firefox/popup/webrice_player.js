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



var PlayIconState = document.getElementById("webricePlayIcon");


//settings
var SettingsIconState = document.getElementById("webriceSettingsButton");
console.log (" Trial state play Safa is ",SettingsIconState);

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

    //if it stopped then play from begining
    if (PlayIconState.classList.contains("appear"))
      {PlayIconState.classList.replace("appear","hide");
      }

    if (PauseIconState.classList.contains("hide"))
    PauseIconState.classList.add("appear");

}

const SettingsState = () => {
  console.log('settings verified state');
  const settingsOverlay = document.createElement('div');
  settingsOverlay.setAttribute('id', "overlay");
  document.body.appendChild(settingsOverlay);
  console.log('settings overlay is ', settingsOverlay);

}

const listenForClicks = () => {
    document.addEventListener('click', e => {
        const targetId = e.target.id;
        let action = '';

        if      (tags['play'].includes(targetId))       {
          action = 'play';
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
        else if (tags['settings'].includes(targetId))
        { action = 'settings';
        //console.log (" Trial state play Safa is ",SettingsIconState.id);
        SettingsState();
        }

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
