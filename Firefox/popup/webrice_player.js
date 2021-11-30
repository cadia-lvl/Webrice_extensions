const tags = {
    'play': [
            'webricePlayButton',
            'webricePlayIcon',
            'webriceEarIcon'
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

const listenForClicks = () => {
    document.addEventListener('click', e => {
        const targetId = e.target.id;
        let action = '';

        if      (tags['play'].includes(targetId))       { action = 'play'; }
        else if (tags['stop'].includes(targetId))       { action = 'stop'; }
        else if (tags['speed'].includes(targetId))      { action = 'speed'; }
        else if (tags['settings'].includes(targetId))   { action = 'settings'; }

        if(action !== '') { 
            controlRouter(action);
            action = ''; 
        }
    });
}

const reportExecuteScriptError = error => { console.error(error); }
browser.tabs.executeScript({file: '/content_scripts/input_processing.js'})
    .then(listenForClicks)
    .catch(reportExecuteScriptError);