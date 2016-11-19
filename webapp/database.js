'use strict';

const mongojs = require("mongojs");
const db = mongojs("mongodb://localhost:27017/postit");
const textBlocks = db.collection("textBlocks");
const ownerBlocks = db.collection("ownerBlocks");

exports.storeBlockText = function(experimentid, timeid, text) {
  var blockData = {
    experimentid: experimentid,
    timeid: timeid,
    text: text
  }
  textBlocks.insert(blockData, function(err, result){
     if(err) {
         console.log(err);
     }
  });
};

exports.storeBlockOwner = function(experimentid, timeid, owner) {
  var blockData = {
    experimentid: experimentid,
    timeid: timeid,
    owner: owner
  }

  ownerBlocks.insert(blockData, function(err, result){
     if(err) {
         console.log(err);
     }
  });
};

exports.getBlocksText = function(experimentid, timeid, cb) {
  textBlocks.find({
    experimentid: experimentid*1,
    timeid: {"$gte": timeid*1}
  }, cb);
};

exports.getBlocksOwner = function(experimentid, timeid, cb) {
  ownerBlocks.find({
    experimentid: experimentid*1,
    timeid: {"$gte": timeid*1}
  }, cb);
}

