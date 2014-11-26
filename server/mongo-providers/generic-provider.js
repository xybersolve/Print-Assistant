module.exports = function(mongoWrap, collectionName ){ 'use strict';

  var wrap = mongoWrap
    , colName = collectionName;

  return {
    findAll: function (opts, cb) {
      wrap.connect(function (err, db) {
        if (err) return cb(err);
        db.collection(colName)
          .find({})
          .toArray(function (err, data) {
            if (err) return cb(err);
            cb(null, data);
          });
      });
    },
    findById: function (opts, cb) {
      var id    = opts.id;
      wrap.connect(function (err, db) {
        if (err) return cb(err);
        db.collection(colName)
          .find({_id: wrap.ObjectID(id)})
          .toArray(function (err, doc) {
            if (err) return cb(err);
            cb(null, doc);
          });
      });
    },
    update: function (opts, cb) {
      // update existing item
      var id    = opts.id
        , data  = opts.data;

      delete data._id; // not updating _id
      //console.log('id: ' + id); console.dir(data);

      wrap.connect(function (err, db) {
        if (err) return cb(err);
        db.collection(colName)
          .update({_id: wrap.ObjectID(id) },
          {'$set': data}, {safe: true, multi: false}, function (err, results) {
            if (err) return cb(err);

            var code = results === 1 ? {success: true} : {success: false};
            cb(null, code);
          });
      });
    },
    // save new item
    save: function (opts, cb) {
      var id    = opts.id
        , data = opts.data;

      wrap.connect(function (err, db) {
        if (err) return cb(err);
        db.collection(colName)
          .insert(data, {safe: true}, function (err, result) {
            if (err) return cb(err);

            var code = result === 1 ? {success: true} : {success: false};
            cb(null, code);
          });
      });
    },
    delete: function (opts, cb) {
      var id    = opts.id;

      wrap.connect(function (err, db) {
        if (err) return cb(err);
        db.collection(colName)
          .remove({_id: wrap.ObjectID(id)}, function (err, results) {
            if (err) return cb(err);

            var code = results === 1 ? {result: true} : {result: false};
            cb(null, code);
          });
      });
    }
  }; // end return block
};