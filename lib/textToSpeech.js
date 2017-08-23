const Speak = require('tts-speak');

let speakInstance;

module.exports.init = () => new Promise((resolve) => {
    speakInstance = new Speak({
        tts: {
            engine: {                       // The engine to use for tts
                name: 'voicerss',
                key: process.env.VOICERSS_APIKEY,     // The API key to use
            },
            lang: 'en-us',                  // The voice to use 'fi-fi'
            speed: 50,                      // Speed in %
            format: 'mp3',                  // Output audio format
            quality: '44khz_16bit_stereo',  // Output quality
            cache: `${__dirname}/cache`,    // The cache directory were audio files will be stored
            loglevel: 0,                    // TTS log level (0: trace -> 5: fatal)
            delayAfter: 0,                   // Mark a delay (ms) after each message
        },
        speak: {
            volume: 80,                     // Audio player volume
            loglevel: 0,                     // Audio player log level
        },
        loglevel: 0,                         // Wrapper log level
    });

    speakInstance.once('ready', () => {
        const say = msg => new Promise((resolveSpeak) => {
            speakInstance
                .say(msg)
                .once('idle', () => {
                    resolveSpeak();
                });
        });
        resolve(say);
    });
});
