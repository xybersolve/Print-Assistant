/*
  Prints Route Provider
*/
var express     = require('express')
  , router      = express.Router()
  , prints      = null
  , routeLogger = require('./../middleware/route-logger')('/prints');

module.exports = function(printProvider) { 'use strict';
  prints = printProvider;
  //router.user(routeLogger)

  // GET /
  // get all prints
  router.get('/', function(req, res, next){
    prints.findAll({owner: req.owner}, function(err, result) {
      if(err) return next(err);
      res.json(result);
    });
  });
  // GET /:id
  // get one print by _id
  router.get('/:id', function(req, res, next){
    prints.findById({id: req.params.id}, function(err, result) {
      if(err) return next(err);
      res.json(result);
    });
  });

  // POST /
  // save new or cloned print (no _id)
  router.post('/', function(req, res, next){

    var opts = {
      owner:   req.owner,
      data:    req.body
    };
    prints.insert(opts, function(err, result) {
      if(err) return next(err);
      res.json(result);
    });
  });
  // PUT /:id
  // update existing print by id (_id)
  router.put('/:id', function(req, res, next){
    var opts = {
      id:    req.params.id,
      data:  req.body,
      owner: req.owner
    };
    prints.update(opts, function(err, code) {
      if(err) return next(err);
      res.json( code );
    });
  });
  // DELETE  /:id
  // delete print by id
  router.delete('/:id', function(req, res, next){
    var opts = {
      id:  req.params.id
    };
    prints.delete(opts, function(err, code) {
      if(err) return next(err);
      res.json( code );
    });
  });

  // used to update print model on client when state changes
  router.post('/prep/print', function(req, res, next) {
    var print = req.body;
    print.owner = req.owner; // just to be safe
    prints.prepPrint(print, function(err, print) {
      if(err) return next (err);
      res.json({print:print});
    });
  });

  // used to update print model on client when state changes
  router.post('/invoice', function(req, res, next) {
    var opts = req.body;
    opts.owner = req.owner; // just to be safe

    prints.prepareInvoice(opts, function(err, doc) {
      if(err) return next (err);

      //res.json({print:print})
    });
  });

  return router;
};
