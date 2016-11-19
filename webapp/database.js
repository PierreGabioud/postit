'use strict';

const mongojs = require("mongojs");
const db = mongojs("mongodb://localhost:27017/postit");
const blocks = db.collection("blocks");

exports.addBlock = function(blockData){
    blocks.insert(blockData, function(err, result){
       if(err) {
           console.log(err);
       }

       console.log('Done adding block');
    });
};

