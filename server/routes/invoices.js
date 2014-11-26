var express      = require('express')
  , router       = express.Router()
  , invoices     = null
  , generator    = null;

module.exports = function(invoiceProvider, invoiceGenerator) { 'use strict';
  invoices  = invoiceProvider;
  generator = invoiceGenerator;

  // POST /api/invoices/:name
  // invoice request
  router.post('/invoice/send', function(req, res, next) {
    var opts = {
      owner:  req.owner,
      data:   req.body
    };
    invoices.invoice(opts, function(err, results) {
      if(err) return next(err);
      generator.makeInvoice(results, function(err, result) {
        if(err) return console.log('Error: ' + err);
        //if(err) return res.json({success:false});
        res.json({success:true});
      });
    });
  });

  router.post('/invoice/send/:name', function(req, res, next) {
    var responded = false;
    var opts = {
      owner:  req.owner,
      data:   req.body,
      name:   req.params.name
    };
    invoices[opts.name](opts, function(err, data) {
      if(err) return next(err);
      generator.makeInvoice(opts.name, data, function(err, result) {
        //if(err) return console.log('Error: ' + err);
        if(responded !== true){
          responded = true;
          res.json({success:true});
        }
      });
    });
  });
  return router;
};
