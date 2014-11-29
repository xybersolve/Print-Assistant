var express     = require('express')
  , fs          = require('fs')
  , router      = express.Router()
  , images      = null;

module.exports = function(imageProvider) { 'use strict';
  images = imageProvider;

  router.get('/', function(req, res, next){
    var opts = {
      owner:   req.owner
    };
    images.findAll(opts, function(err, data) {
      if(err) return next(err);
      res.json(data);
    });
  });

  // get one image by _id
  router.get('/:id', function(req, res, next){
    images.findById({id: req.params.id}, function(err, data) {
      if(err) return next(err);
      res.json(data);
    });
  });
  // new image
  router.post('/', function(req, res, next){
    var opts = {
      owner: req.owner,
      data:  req.body
    };
    images.save(opts, function(err, result) {
      if(err) return next(err);
      res.json(result);
    });
  });

  // update image by id
  router.put('/:id', function(req, res, next){
    var opts = {
      owner: req.owner,
      id:   req.params.id,
      data: req.body
    };
    images.update(opts, function(err, code) {
      if(err) return next(err);
      res.json( code );
    });
  });

  router.delete('/', function(req, res, next){
    images.delete({id: req.params.id}, function(err, code) {
      if(err) return next(err);
      res.json( code );
    });
  });

  router.post('/upload/', function(req, res, next) {
    fs.readFile(req.files.image.path, function(err, data) {
      if(err) return next(err);
      var imageName = req.files.image.name;
      if(! imageName) return next(new Error('Unable to get uploaded file name'));
      var imagePath = __dirname + '/uploads/fullsize/' + imageName;
      fs.writeFile(imagePath, data, function(err) {
        if(err) return next(err);
        res.redirect('/uploads/fullsize/' + imageName);
      });
    });

  });
  return router;
};

