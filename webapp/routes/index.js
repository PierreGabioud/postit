exports.register = function(server, options, next) {

    server.route({
        method:"GET",
        path:"/",
        handler: function(request, reply) {
            reply.view("index");
        },
    });

    return next();
};

exports.register.attributes = {
    name: "route-basic"
};