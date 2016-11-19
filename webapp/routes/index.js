exports.register = function(server, options, next) {
    const db = server.app.db;


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