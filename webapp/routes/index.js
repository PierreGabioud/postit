// var wav = require('wav');
var headerGen = require("waveheader");

exports.register = function(server, options, next) {

    server.route({
        method:"GET",
        path:"/",
        handler: function(request, reply) {
            reply.view("index");
        },
    });


    var io = require('socket.io')(server.listener);
    var fs = require('fs');


    var profiles = [
        '2876eb8f-37f4-4c53-8429-1364ffad4f45', //Bengi
        'a499ce4c-6639-4940-82cc-3f9485e55370', //Marco
        '26c07b8e-4537-4ff7-bc68-8686725942e8'  //Pierre
    ]

    var count = 0;

    io.on('connection', function (socket) {
        var audioBatch = null;
        var count = 0;

        socket.on('audioData', function (payload) {

            // var test = JSON.stringify(payload.audioBuffer);
            if (!audioBatch) audioBatch = payload.audioBuffer;
            else audioBatch = Buffer.concat([audioBatch, payload.audioBuffer]);
            // console.log(test);

            var out = Buffer.concat([headerGen(0), audioBatch]);
            fs.writeFileSync('demo.wav', out);


            // var fileWriter = new wav.FileWriter('demo.wav', {
            //     channels: 1,
            //     sampleRate: 48000,
            //     bitDepth: 16
            //   });
            // console.log(streamifier.createReadStream(payload.audioBuffer)) //.pipe(fileWriter);

           // var out = wav.encode(audioBatch, { sampleRate: 16000, float: true, bitDepth: 16 });
            // console.log(out)
            // fs.writeFileSync('audio.wav', out, 'binary');


            // count++;
            // if(count >= 100){
            //     // process batch to API
            //     console.log('100 blocks received');
            //     console.log(audioBatch);

            //     //convert to WAV
            //     var wav = require('node-wav');
            //     wav.encode(audioBatch, { sampleRate: 16000, float: true, bitDepth: 16 });
            //     fs.writeFileSync('audio3.wav', test);

            //     //identify speaker on this block.

            //     //identify(profiles, wav).then(function saveSpeaker(status){
            //       //  console.log(status);


            //      //   }
            //     //);
            //     count = 0;
            // }
        });
    });

    return next();
};

exports.register.attributes = {
    name: "route-basic"
};
