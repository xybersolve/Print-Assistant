var express   = require('express')
  , router    = express.Router()
  , actions     = null;

module.exports = function(actionProvider) { 'use strict';

  actions = actionProvider;

  router.get('/', function(req, res, next){
    // #TODO actions will be owner keyed
    actions.findAll({}, function(err, data) {
      if(err) return next(err);
      res.json(data);
    });
  });

  router.get('/:id', function(req, res, next) {
    actions.findById({id: req.params.id}, function (err, data) {
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
    actions.insert(opts, function(err, code) {
      if(err) next(err);
      res.json(code);
    });
  });

  router.delete('/:id', function(req, res, next) {
    actions.delete({id: req.params.id}, function(err, code) {
      if(err) next(err);
      res.json(code);
    });
  });

  return router;
};
