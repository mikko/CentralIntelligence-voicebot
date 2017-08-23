const CIClient = require('ci-client');
const CIconfig = require('./client-config.js');
const keypress = require('keypress'); // TODO: remove this after proper RPi setup

const TTS = require('./lib/textToSpeech');
const STT = require('./lib/speechToText');

let outputText = text => console.log('TTS not ready');

TTS.init().then(say => outputText = say);

const client = new CIClient(CIconfig);

const messageReceiver = (action, message, context) => {
    outputText(message);
};

client.setReceiver(messageReceiver);

client.setPrivateChatParser(ctx => 'public'); // This is designed to work in a public space

client.setUserPropertiesParser(ctx => ({}));

// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);

let active = false;

// listen for the "keypress" event TODO: remove this after proper RPi setup
process.stdin.on('keypress', function (ch, key) {
    if (key && key.name !== 'space') {
        process.stdin.pause();
        process.exit();
    } else {
        if (!active) {
            active = true;
            STT.listen()
                .then(results => {
                    const texts = results[0].alternatives.map(alt => alt.transcript);
                    console.log(`Sending message ${texts[0]}`);

                    client.sendMessage(texts[0]);
                    active = false;
                })
                .catch(err => console.log(err));
        } else {
            STT.stop();
            active = false;
        }
    }
});

process.stdin.setRawMode(true);
process.stdin.resume();


