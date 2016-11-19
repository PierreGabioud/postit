var request = require('request');

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
console.log(body);
    console.log('Got JSON token');

    request({
       url: 'https://speech.platform.bing.com/recognize',
        method: 'POST',
        headers: {
           'Authorization': 'Bearer '+JWT
        }
    }, function(error, response, body) {
        //console.log(error);
        //console.log(response);
        console.log(body);
    });


}

request(options, callback);

