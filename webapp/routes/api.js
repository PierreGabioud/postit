var db = require('../database');
var _ = require('underscore');

/*
 db.storeBlockText(0, 0, "lalal");
 db.storeBlockText(0, 1, "blabla");

 db.storeBlockOwner(0, 0, "marco");
 db.storeBlockOwner(0, 1, "pierre");
 db.storeBlockOwner(0, 1, "ben");
 */

var users = ['marco', 'pierre', 'ben'];
function randomGuy() {
    return users[Math.floor(Math.random()*users.length)];
}

var words = 'takenote that is a wonderful idea I look forward takenote to seeing you in hell you dumbass takenote bullhock even summer is takenote too much hell for you to see you bitch I like it you love it even though you go to the club not only should we imagine a new world but I can only feel the pain in my brain you babydoll pierre marco pierre';
words = words.split(' ');


function getRandomSentence(){
    function getRandomWord() {
        return words[Math.floor(Math.random()*(words.length-1))];
    }

    var string = "";
    for(var i=0; i<Math.random()*20; i++) {
        string += getRandomWord()+' ';
    }

    return string;

}

exports.register = function(server, options, next) {
    server.route({
        method: "GET",
        path: "/api/blockText/{expid}/{timeid?}",
        handler: function (request, reply) {
            expid = encodeURIComponent(request.params.expid);
            timeid = request.params.timeid ? encodeURIComponent(request.params.timeid) : 0;

            console.log('expID = '+expid+', '+timeid);


            db.getBlocksText(expid, timeid, function (err, blocks) {
                reply(blocks);
            });
        },
    });


    server.route({
        method: "GET",
        path: "/api/blockOwner/{expid}/{timeid?}",
        handler: function (request, reply) {
            expid = encodeURIComponent(request.params.expid);

            console.log('expID = '+expid+', '+request.params.timeid);

            timeid = request.params.timeid ? encodeURIComponent(request.params.timeid) : 0;
            db.getBlocksOwner(expid, timeid, function (err, blocks) {
                reply(blocks);
            });
        },
    });

    server.route({
        method: 'POST',
        path: '/api/createFakeBlock/{expid}/{timeid}',
        handler: function(request, reply) {
            db.storeBlockOwner(parseInt(request.params.expid), parseInt(request.params.timeid), randomGuy(), function(err, res){
                console.log(err);
            });
            db.storeBlockText(parseInt(request.params.expid), parseInt(request.params.timeid), getRandomSentence(), function(err, res){
                console.log(err);
            });
            reply('OK');
        }
    });


    return next();
};

exports.register.attributes = {
    name: "route-api"
};
