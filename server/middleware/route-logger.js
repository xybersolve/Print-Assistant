module.exports = function(basePath) { 'use strict';
  var base = basePath;
  return function(req, res, next){
    console.log(req.method +': ' + base + req.url);
    next(0);
  };
};
