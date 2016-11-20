var request = require('request');
var fs = require('fs');

var subs_key = '33cdb7f928d3451cbbae38849f6be56d';


function createProfile (file) {
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
        file: file
      });
    }

    request(options, callback);
  })
}

function createEnrollment (params) {
  console.log(params.file, params.key);
  // var wav = fs.readFileSync(params.name + '.wav');
  var wav = params.file

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
      console.log(JSON.stringify(response))
      console.log(response.headers['operation-location'])
      checkForCompletion(response.headers['operation-location'], resolve, reject);
    }
    request(options, callback);
  });
}


/*
3405951d-6cbf-470f-8a02-65bdcbd9ba80 // marco
9b30616a-8bd6-4334-8626-a1e909b3ffe9 // pierre
2bc52c64-0b9e-46bd-b397-60f5ee0ec580 // benji
*/

// createProfile(fs.readFileSync('ben.wav')).then(createEnrollment);
// identify(['a499ce4c-6639-4940-82cc-3f9485e55370', '26c07b8e-4537-4ff7-bc68-8686725942e8'], fs.readFileSync('test.wav'););
