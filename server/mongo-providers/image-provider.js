var _      = require('underscore')
  , async  = require('async');

module.exports = function(mongoWrap){ 'use strict';
  var wrap = mongoWrap
    , collectionName = 'images';
    //, imageUtils = require('./image-utils')(mongoWrap);

  return {

    findAll: function (opts, cb) {
      var query = {
        collection: collectionName,
        where: {owner: opts.owner, active: true},
        sort: {name: 1, sizeSort: 1}
      };
      wrap.findAll(query, function(err, results){
        if(err) return cb(err);
        cb(null, results);
      });
    },
    findById: function (opts, cb) {
      opts.collection = collectionName;
      wrap.findById(opts, function(err, result){
        if(err) return cb(err);
        cb(null, result);
      });
    },
    // update existing image
    update: function (opts, cb) {
      var gotNameChange = false,
          gotLineChange = false,
          updateData = {},
          updateQuery = {};

      // update existing image
      opts.collection = collectionName;

      wrap.findById(opts, function (err, image) {
        // get original and compare for changes
        gotNameChange = ! _.isEqual(image.name !== opts.data.name);
        gotLineChange = ! _.isEqual(image.lines!== opts.data.lines);

        async.series({
          updatePrintChanges: function(cb){
            console.log('updatePrintChanges()');
            if(gotNameChange || gotLineChange){

              if(gotNameChange)  _.extend(updateData, {name: opts.data.name});
              if(gotLineChange)  _.extend(updateData, {lines: opts.data.lines});
              _.extend(updateQuery, {name: image.name, owner: opts.owner});

              wrap.db.collection('prints')
                  .update( updateQuery,
                           {$set: updateData},
                           {w:1, upsert: false, multi:true},
                  function(err, result) {
                    if(err) return cb(err);
                    cb(null, result);
                });

            } else {
              // no changes -- pass it on to update
              cb(null, 0);
            }
          },
          updateImage: function() {
            wrap.updateById(opts, function(err, code){
              if(err) return cb(err);
              cb(null, code);
            });
          }
        });


        //if(image.lines)
      });

    },

    // save new image
    saveImage: function(opts, cb) {
      //opts.data.fileStub = imageUtils.formatFileStubName(opts.data.name);


    },
    save: function (opts, cb) {
      opts.collection = collectionName;
      opts.data.owner = opts.owner;

      //imageUtils.uploadFile(opts.data);
      //wrap.show(opts.data);

      wrap.insert(opts, function(err, result){
        if(err) return cb(err);
        cb(null, result);
      });
      /*
      wrap.connect(function (err, db) {
        if (err) return cb(err);
        db.collection(colName)
          .insert(image, {safe: true}, function (err, result) {
            if (err) return cb(err);

            var code = result === 1 ? {success: true} : {success: false};
            cb(null, code);
          })
      });*/
    },
    delete: function (opts, cb) {
      opts.collection = collectionName;
      wrap.removeById(opts, function(err, code){
        if(err) return cb(err);
        cb(null, code);
      });
      /*
      wrap.connect(function (err, db) {
        if (err) return cb(err);
        db.collection(colName)
          .remove({_id: wrap.ObjectID(id),
            owner: owner}, function (err, results) {
            if (err) return cb(err);

            var code = results === 1 ? {result: true} : {result: false};
            cb(null, code);
          });
      });*/
    }
  }; // end return block
};