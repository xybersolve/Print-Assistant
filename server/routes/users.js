var express   = require('express')
  , router    = express.Router()
  , users     = null;

module.exports = function(userProvider) { 'use strict';

  users = userProvider;

  router.get('/', function(req, res, next){
    users.findAll({}, function(err, data) {
      if(err) return next(err);
      res.json(data);
    });
  });

  router.get('/:id', function(req, res, next) {
    users.findById({id: req.params.id}, function (err, data) {
      if(err) return next(err);
      res.json(data);
    });
  });
  // save new user
  router.post('/', function(req, res, next) {
    var opts = {
      data:  req.body
    };
    users.insert(opts, function(err, code) {
      if(err) next(err);
      res.json(code);
    });
  });

  // PUT /:id
  // update existing user by id (owner)
  router.put('/:id', function(req, res, next){
    var opts = {
      id:    req.params.id,
      data:  req.body,
      owner: req.owner
    };
    users.update(opts, function(err, code) {
      if(err) return next(err);
      res.json( code );
    });
  });

  router.delete('/:id', function(req, res, next) {
    users.delete({id: req.params.id}, function(err, code) {
      if(err) next(err);
      res.json(code);
    });
  });

  return router;
};
