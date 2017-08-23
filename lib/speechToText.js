const Speech = require('@google-cloud/speech');
const record = require('node-record-lpcm16');

const options = {
    config: {
        // Configure these settings based on the audio you're transcribing
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: 'en-US',
    },
};

module.exports.listen = () => {
    // Instantiates a client
    const speech = Speech({
        projectId: 'digi-krisse',
        keyFilename: 'credentials.json',
    });

    return new Promise((resolve, reject) => {
        // Create a recognize stream
        const recognizeStream = speech.streamingRecognize(options)
            .on('error', err => {
                console.log(err);
                reject(err);
            })
            .on('data', (data) => {
                console.log(JSON.stringify(data, null, 2));
                if (data.speechEventType === 'SPEECH_EVENT_UNSPECIFIED') {
                    resolve(data.results);
                    record.stop();
                }
            });

        // Start recording and send the microphone input to the Speech API
        record.start({sampleRate: 16000}).pipe(recognizeStream);

        console.log('Recording started');
    });
};

module.exports.stop = () => {
    record.stop();
};
