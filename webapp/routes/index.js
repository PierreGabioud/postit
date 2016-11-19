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

        socket.on('audioData', function (payload) {
            console.log('received' + JSON.stringify(payload));

        });
    });

    return next();
};

exports.register.attributes = {
    name: "route-basic"
};