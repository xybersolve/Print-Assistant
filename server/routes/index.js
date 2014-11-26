var express = require('express')
  , router = express.Router();

module.exports = function(){ 'use strict';
  router.get('/', function(req, res, next){
    res.sendFile('index.html');
  });
  return router;
};
