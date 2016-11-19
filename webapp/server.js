const Hapi = require('hapi');
const Inert = require("inert");
const Vision = require('vision');

// Create a server with a host and port
const server = new Hapi.Server();


server.connection({
    port: 8000,
    address: "127.0.0.1"
});


server.register(Inert, () => {});


server.register([
    require("./routes/index.js"), //Basic views
    require("./routes/api.js"), //Basic views
], (err) => {
    if(err) {
        throw err;
    }

    server.start((err) => {
        if(err) {
            console.log("Error starting the server");
            console.log(err);
        }
        console.log("Server running at "+server.info.uri+":"+server.info.port+" right now");
    })

});


server.register(Vision, (err) => {

    server.views({
        engines: {
            html: require('handlebars')
        },
        relativeTo: __dirname,
        path: 'templates',
        partialsPath: "./partials",
        helpersPath: "./templateHelpers"
    });
});

//Serving static files
server.route({
    method: 'GET',
    path: '/public/{param*}',
    handler: {
        directory: {
            path: "./public",
            redirectToSlash: true,
            index: true,
        }
    },
    config: {
        auth: false
    }
});


module.exports = server;
