var express   = require('express')
  , router    = express.Router()
  , lines     = null;

module.exports = function(lineProvider) { 'use strict';

  lines = lineProvider;

  router.get('/', function(req, res, next){
    // lines are owner keyed
    lines.findAll({owner: req.owner}, function(err, data) {
      if(err) return next(err);
      res.json(data);
    });
  });

  router.get('/:id', function(req, res, next) {
    lines.findById({id: req.params.id}, function (err, data) {
      if(err) return next(err);
      res.json(data);
    });
  });

  router.post('/', function(req, res, next) {
    var opts = {
      owner: req.owner,
      data:  req.body
    };
    lines.insert(opts, function(err, code) {
      if(err) next(err);
      res.json(code);
    });
  });

  router.delete('/:id', function(req, res, next) {
    lines.delete({id: req.params.id}, function(err, code) {
      if(err) next(err);
      res.json(null, code);
    });
  });

  return router;
};
