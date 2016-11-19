exports.register = function(server, options, next) {

    server.route({
        method:"GET",
        path:"/",
        handler: function(request, reply) {
            reply.view("index");
        },
    });


    var io = require('socket.io')(server.listener);

    var count = 0;

    io.on('connection', function (socket) {

        socket.on('audioData', function (payload) {
            count++;
            if(count == 100) {
                console.log('5 seconds done');
                count = 0;
            }
        });
    });

    return next();
};

exports.register.attributes = {
    name: "route-basic"
};