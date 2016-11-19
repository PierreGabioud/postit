var db = require('../database');
var _ = require('underscore');
// db.storeBlockText(0, 0, "lalal");
// db.storeBlockText(0, 1, "blabla");

// db.storeBlockOwner(0, 0, "marco");
// db.storeBlockOwner(0, 1, "pierre");


exports.register = function(server, options, next) {


  var words = 'that is a wonderful idea I look forward to seeing you in hell you dumbass bullhock even summer is too much hell for you to see you bitch I like it you love it even though you go to the club';
  var people = ['Pierre', 'Marco', 'BenJ'];
  words = words.split(' ');


  function getRandomSentence(){
    function getRandomWord() {
      return words[Math.floor(Math.random()*(words.length-1))];
    }

    var string = "";
    for(var i=0; i<Math.random()*12; i++) {
      string += getRandomWord()+' ';
    }

    return string;

  }

  function getRandomPerson() {
    return people[Math.floor(Math.random()*people.length)];
  }


  server.route({
    method:"GET",
    path:"/api/blockText/{expid}/{timeid?}",
    handler: function(request, reply) {
      expid = encodeURIComponent(request.params.expid);
      timeid = request.params.timeid ? encodeURIComponent(request.params.timeid) : 0;
      db.getBlocksText(expid, timeid, function(err, blocks) {
        reply(blocks);
      });
    },
  });


  server.route({
    method:"GET",
    path:"/api/blockOwner/{expid}/{timeid?}",
    handler: function(request, reply) {
      expid = encodeURIComponent(request.params.expid);
      timeid = request.params.timeid ? encodeURIComponent(request.params.timeid) : 0;
      db.getBlocksOwner(expid, timeid, function(err, blocks) {
        reply(blocks);
      });
    },
  });


  return next();
};

exports.register.attributes = {
  name: "route-api"
};
