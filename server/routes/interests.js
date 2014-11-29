var express   = require('express')
  , router    = express.Router()
  , interests     = null;

module.exports = function(interestProvider) { 'use strict';

  interests = interestProvider;

  router.get('/', function(req, res, next){
    interests.findAll({}, function(err, data) {
      if(err) return next(err);
      res.json(data);
    });
  });

  router.get('/:id', function(req, res, next) {
    interests.findById({id: req.params.id}, function (err, data) {
      if(err) return next(err);
      res.json(data);
    });
  });
  
  // save new lead
  router.post('/', function(req, res, next) {
    var opts = {
      owner: req.owner,
      data:  req.body
    };
    interests.insert(opts, function(err, code) {
      if(err) next(err);
      res.json(code);
    });
  });

  router.delete('/:id', function(req, res, next) {
    interests.delete({id: req.params.id}, function(err, code) {
      if(err) next(err);
      res.json(code);
    });
  });

  return router;
};
