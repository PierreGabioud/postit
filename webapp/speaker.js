var request = require('request');
var fs = require('fs');

var subs_key = 'ac03208e324d47369daad0ceec6a6912';


function createProfile (name) {
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

  return new Promise(function(resolve) {
    function callback(error, response, body) {
      resolve({
        key: JSON.parse(body).identificationProfileId,
        name: name
      });
    }

    request(options, callback);
  })
}

function createEnrollment (params) {
  console.log(params.name, params.key);
  var wav = fs.readFileSync(params.name + '.wav');

  var options = {
    url: 'https://api.projectoxford.ai/spid/v1.0/identificationProfiles/' + params.key + '/enroll?shortAudio=true',
    headers: {
      'Content-Type': 'multipart/form-data',
      'Ocp-Apim-Subscription-Key': subs_key
    },
    body: wav,
    method:'POST'
  };
  return new Promise(function(resolve, reject) {

    function callback(error, response, body) {
      checkForCompletion(response.headers['operation-location'], resolve, reject);
    }

    request(options, callback);
  });
}

function getEnrollmentStatus (url) {
  var options = {
    url: url,
    headers: {
      'Ocp-Apim-Subscription-Key': subs_key
    },
    method:'GET'
  };

  return new Promise (function (resolve){
    function callback(error, response, body) {
      resolve(body);
    }
    request(options, callback);
  });
}

function checkForCompletion (url, resolve, reject) {
  var loop = function() {
    getEnrollmentStatus(url).then(function(status){
      status = JSON.parse(status);
      console.log(status);
      switch (status.status) {
        case 'notstarted':
          setTimeout(loop, 2000);
          break;
        case 'running':
          setTimeout(loop, 2000);
          break;
        case 'failed':
          reject(status);
          break;
        case 'succeeded':
          switch (status.processingResult.enrollmentStatus) {
            case 'Enrolling':
              setTimeout(loop, 2000);
              break;
            case 'Training':
              setTimeout(loop, 2000);
              break;
            case 'Enrolled':
              resolve(status);
              break;
          }
          break;
        }
      });
    };
    loop();
};

exports.identify = function(profiles, wav) {
  // var wav = fs.readFileSync(filename + '.wav');
  console.log(wav);

  var options = {
    url: 'https://api.projectoxford.ai/spid/v1.0/identify?identificationProfileIds=' + profiles.join(',') + '&shortAudio=true',
    headers: {
      'Content-Type': 'multipart/form-data',
      'Ocp-Apim-Subscription-Key': subs_key
    },
    body: wav,
    method:'POST'
  };

  return new Promise(function(resolve, reject) {

    function callback(error, response, body) {
      console.log(response.headers['operation-location'])
      checkForCompletion(response.headers['operation-location'], resolve, reject);
    }
    request(options, callback);
  });
}



// createProfile('marco').then(createEnrollment);
// identify(['a499ce4c-6639-4940-82cc-3f9485e55370', '26c07b8e-4537-4ff7-bc68-8686725942e8'], fs.readFileSync('test.wav'););
