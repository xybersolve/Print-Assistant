var express = require('express')
  ,router = express.Router()
  ,routeLogger = require('./../middleware/route-logger')('/ratios');


router.get('/', function(req, res, next){ 'use strict';
  var dbWrap = req.dbWrap;

  dbWrap.connect(function (err, db) {
    db.collection('aspectRatios')
      .find({})
      .sort({sortOrder:1})
      .toArray(function(err, doc){
        if(err) throw err;
        res.json(doc);
      });
  });
});
module.exports = router;
