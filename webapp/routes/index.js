// var wav = require('wav');
var headerGen = require("waveheader");
var wav = require('node-wav');
const spawn = require('child_process').spawn;


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

    var count = 0;

    io.on('connection', function (socket) {
        var audioBatch = null;
        var count = 0;
        var timeid = 0;

        socket.on('audioData', function (payload) {

            // var test = JSON.stringify(payload.audioBuffer);
            if (!audioBatch) {audioBatch = payload.audioBuffer;}
            else {audioBatch = Buffer.concat([audioBatch, payload.audioBuffer])};
            // console.log(test);


            count++;
            if (count == 25) {
                count = 0;
                var out = Buffer.concat([headerGen(audioBatch.length), audioBatch]);
                fs.writeFile('0.wav', out, () => {
                    var job = spawn('ffmpeg', ['-i', '0.wav', '-ac', '1', '-acodec', 'pcm_s16le', '-ar', '16000', '-y', '0_out.wav']);

                    job.on('close', (code) => {
                        fs.readFile('0_out.wav', (err, outFinal) => {
                            require('../controllers/block.js').treatBlock(timeid, outFinal);
                        });
                    });
                });
                audioBatch = null;
                timeid++;
            }
        });
    });

    return next();
};

exports.register.attributes = {
    name: "route-basic"
};
