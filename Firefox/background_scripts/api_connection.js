const cmd_types = ['tts'];

// TODO: Implement or connet to service
const normalizeText = text => {
    return text;
}

const prepareTextForTts = webText => {
    console.info(webText);
    const webTextArray = webText.split(/\.+/);

    // Filter out segments which are only white space
    const webTextArrayFiltered = webTextArray
        .filter((seg) => seg.trim().length != 0);

    console.info(webTextArrayFiltered);
    return webTextArrayFiltered;
}

const tts = text => {
    const type = 'tts';
    const audio = '';

    const voiceName = 'Karl';
    const audioType = 'mp3';
    const url = 'https://tts.tiro.is/v0/speech';

    return fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'accept': 'audio/mpeg',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
        Engine: 'standard',
        LanguageCode: 'is-IS',
        LexiconNames: [],
        OutputFormat: audioType,
        SampleRate: '16000',
        SpeechMarkTypes: [],
        Text: text,
        TextType: 'text',
        VoiceId: voiceName,
        }),
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(`${res.status} = ${res.statusText}`);
                // throw new Error('Network did not respond with audio file');
            }
            return res.blob();
        })
        .then(audStream => {
            // don't forget to URL.revokeObjectURL(url) when finished
            const blobURL = window.URL.createObjectURL(audStream);
            return blobURL;
        })
        .catch(error => {
            console.error('No audio received from the tts web service: ', error);
            return '';
        });
};

browser.runtime.onMessage.addListener(
    (message, sender, respond) => {
        if(message.cmd) {
            const cmd = message.cmd;
        
            switch(cmd) {
                case 'tts':
                    if(message.content && message.content.length > 0) {
                        const text = message.content;
                        return new Promise(resolve => {
                            tts(text)
                                .then(url => {
                                    console.log(url);
                                    resolve(url);
                                });
                        });
                    }
                    break;
                default:
                    console.warn('Background script command not recognized.');
            }
        }
    }
);