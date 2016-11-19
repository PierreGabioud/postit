exports.register = function(server, options, next) {

    server.route({
        method:"GET",
        path:"/",
        handler: function(request, reply) {
            reply.view("index");
        },
    });


    var io = require('socket.io')(server.listener);

    io.on('connection', function (socket) {
        var audioBatch = [];
        var count = 0;
        socket.on('audioData', function (payload) {
            //console.log('received' + JSON.stringify(payload));
            audioBatch.concat(payload.audioBuffer.data);

            count++;
            if(count >= 100){
                // process batch to API
                console.log('100 blocks received');

                //convert to WAV
                var wav = require('node-wav');


                count = 0;
            }

        });
    });

    return next();
};

exports.register.attributes = {
    name: "route-basic"
};