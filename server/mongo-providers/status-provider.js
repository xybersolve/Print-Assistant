module.exports = function(mongoWrap){ 'use strict';

  var wrap = mongoWrap
    , collectionName = 'status';

  return {
    findAll: function (opts, cb) {
      var query = {
        where: {owner : opts.owner},
        collection: collectionName
      };
      wrap.findAll(query, function (err, doc) {
        if (err) return cb(err);
        cb(null, doc);
        //wrap.show(doc);
      });
    },
    findById: function (opts, cb) {
      opts.collection = collectionName;
      wrap.findById(opts, function(err, doc) {
        if(err) cb(err);
        cb(null, doc);
      });
    },
    update: function (opts, cb) {
      // update existing status
      opts.collection = collectionName;
      wrap.updateById(opts, function(err, code){
        if(err) return cb(err);
        cb(null, code);
      });
    },
    // save new status
    insert: function (opts, cb) {
      opts.collection = collectionName;
      opts.data.owner = opts.owner;
      wrap.insert(opts, function(err, result) {
        if(err) cb(err);
        cb(null, result);
      });
    },
    delete: function (opts, cb) {
      opts.collection = collectionName;
      wrap.delete(opts, function(err, code) {
        if(err) cb(err);
        cb(null, code);
      });
    }
  }; // end return block
};