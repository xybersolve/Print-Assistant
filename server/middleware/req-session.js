module.exports = function (mongoWrap) { 'use strict';
  var wrap = mongoWrap;
  return function(req, res, next){
    // share mongoWrap with routes
    req.dbWrap = mongoWrap;
    req.db = mongoWrap.db;
    // db keys on owner
    if(req.user){
      req.owner = req.user.username;
    }
    next();
  };
};