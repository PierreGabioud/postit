var request = require('request');
var qs = require('querystring');

var subs_key = 'ac03208e324d47369daad0ceec6a6912';


// function createProfile ()
var options = {
    url: 'https://api.projectoxford.ai/spid/v1.0/identificationProfiles',
    headers: {
        'Content-Type': 'application/json',
        'Host': 'api.projectoxford.ai',
        'Ocp-Apim-Subscription-Key': subs_key
    },
    body: JSON.stringify({
      "locale":"en-us",
    }),
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
           'Authorization': 'Bearer ' + JWT
        }
    }, function(error, response, body) {
        //console.log(error);
        //console.log(response);
        console.log(body);
    });


}

request(options, callback);

