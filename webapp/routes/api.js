var db = require('../database');
var _ = require('underscore');
// db.storeBlockText(0, 0, "lalal");
// db.storeBlockText(0, 1, "blabla");

// db.storeBlockOwner(0, 0, "marco");
// db.storeBlockOwner(0, 1, "pierre");


exports.register = function(server, options, next) {
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
