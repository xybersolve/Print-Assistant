var express = require('express')
  , router  = express.Router()
  , routeLogger = require('./../middleware/route-logger')('/reports')
  , reports = null;

//router.use(routeLogger);

module.exports = function(reportProvider) { 'use strict';
  reports = reportProvider;

  router.get('/', function(req, res, next){
    res.send('/index.html');
  });
  // GET /api/reports/simple/:report
  router.get('/simple/:name', function(req, res, next){
    var reportName = req.params.name;
    reports[reportName]({owner: req.owner}, function(err, data) {
      if(err) return next(err);
      res.json(data);
    });
  });
  router.get('/totals/:name', function(req, res, next){
    var reportName = req.params.name;
    reports[reportName]({owner: req.owner}, function(err, data) {
      if(err) return next(err);
      res.json(data);
    });
  });

  router.get('/printSalesList', function(req, res, next) {
    reports.printSalesList(function(err, data) {
      if(err) return next(err);
      res.json(data);
    });
  });
  router.get('/printTotalByStatus', function(req, res, next) {
    reports.printTotalByStatus(function(err, data) {
      if(err) return next(err);
      res.json(data);
    });
  });
  return router;
};


