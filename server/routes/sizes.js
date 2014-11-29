var express     = require('express')
  , router      = express.Router()
  , sizes   = null;

module.exports = function(sizeProvider) { 'use strict';
  sizes = sizeProvider;

  router.get('/', function(req, res, next){
    sizes.findAll({}, function(err, data) {
      if(err) return next(err);
      res.json(data);
    });
  });

  return router;
};
