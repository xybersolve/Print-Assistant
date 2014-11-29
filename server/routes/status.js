var express   = require('express')
  , router    = express.Router()
  , status    = null;

module.exports = function(statusProvider) { 'use strict';

  status = statusProvider;

  router.get('/', function(req, res, next){
    // status are owner keyed
    status.findAll({owner: req.owner}, function(err, data) {
      if(err) return next(err);
      res.json(data);
    });
  });

  router.get('/:id', function(req, res, next) {
    status.findById({id: req.params.id}, function (err, data) {
      if(err) return next(err);
      res.json(data);
    });
  });

  router.post('/', function(req, res, next) {
    var opts = {
      owner: req.owner,
      data:  req.body
    };
    status.insert(opts, function(err, code) {
      if(err) next(err);
      res.json(code);
    });
  });

  router.delete('/:id', function(req, res, next) {
    status.delete({id: req.params.id}, function(err, code) {
      if(err) next(err);
      res.json(code);
    });
  });

  return router;
};
