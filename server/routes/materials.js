var express     = require('express')
  , router      = express.Router()
  , materials   = null;

module.exports = function(materialProvider) { 'use strict';
  materials = materialProvider;

  router.get('/', function(req, res, next){
    materials.findAll({}, function(err, data) {
      if(err) return next(err);
      res.json(data);
    });
  });

  return router;
};
