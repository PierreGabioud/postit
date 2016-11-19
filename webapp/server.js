var request = require('request'),
    fs = require('fs');

var options = {
    url: 'https://api.cognitive.microsoft.com/sts/v1.0/issueToken',
    headers: {
        'User-Agent': 'request',
        'Ocp-Apim-Subscription-Key': '4aacfbb33c6a4b8eb4573034275111f9'
    },
    method:'POST'
};

function callback(error, response, body) {
    var JWT = body;
    console.log('Got JSON token');


    var wav = fs.readFileSync('audio2.wav');


    request({
       url: 'https://speech.platform.bing.com/recognize',
        method: 'POST',
        headers: {
            'Authorization': 'Bearer '+JWT,
            'Content-Type': 'audio/wav',
        },
        body: wav,
        qs: {
            'Version': '3.0',
            'appID': 'D4D52672-91D7-4C74-8AD8-42B1D98141A5',
            'requestid': 'b2c95ede-97eb-4c88-81e4-80f32d6aee54',
            'instanceid': '1d4b6030-9099-11e0-91e4-0800200c9a66',
            'format': 'json',
            'locale': 'en-US',
            'device.os': 'wp7',
            'scenarios': 'ulm'
        }
    }, function(error, response, body) {
        console.log(error);
        console.log(response.body);


        //console.log(body);
    });


}

request(options, callback);

