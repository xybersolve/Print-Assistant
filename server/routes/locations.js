var express     = require('express')
  , router      = express.Router()
  , locations   = null;



module.exports = function(locationProvider) { 'use strict';
  locations = locationProvider;

  // GET /
  router.get('/', function(req, res, next){
    locations.findAll({owner: req.owner}, function(err, result) {
      //if(err) return handleError(res, err, 500);
      if(err) return next(err);
      res.json(result);
    });
  });
  // GET /:id
  router.get('/:id', function(req, res, next){
    locations.findById({id: req.params.id}, function(err, result) {
      if(err) return next(err);
      res.json(result);
    });
  });
  // POST /
  // save new location
  router.post('/', function(req, res, next) {
    var opts = {
      owner: req.owner,
      data: req.body
    };
    locations.insert(opts, function(err, result) {
      if(err) return next(err);
      res.json(result);
    });
  });
  // PUT /:id
  // update existing location by id
  router.put('/:id', function(req, res, next) {
    var opts = {
      id:   req.params.id,
      data: req.body,
      owner: req.owner
    };
    locations.update(opts, function(err, code) {
      if(err) return next(err);
      res.json(code);
    });
  });
  router.delete('/:id', function(req, res, next) {
    locations.delete({id:req.params.id}, function(err, code) {
      if(err) return next(err);
      res.json(code);
    });
  });
  // Extended Functionality
  router.get('/extended/totals', function(req, res, next){
    locations.findPrintTotals({owner: req.user.username}, function(err, data) {
      if(err) return next(err);
      res.json(data);
    });
  });

  return router;
};

