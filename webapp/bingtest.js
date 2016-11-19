var bb = require('bingspeech-api-client');

// audio input in a Buffer 
var wav = fs.readFileSync('audio.wav');

// Bing Speech Key (https://www.microsoft.com/cognitive-services/en-us/subscriptions) 
var subscriptionKey = {
    string : '4aacfbb33c6a4b8eb4573034275111f9'
};

var client = new bb.BingSpeechClient(subscriptionKey);
client.recognize(wav)
    .then(response => {
    console.log(response.results[0].name);
});