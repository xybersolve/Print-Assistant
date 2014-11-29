module.exports = function(mongoWrap, collectionName ){ 'use strict';

  var wrap = mongoWrap
    , colName = collectionName
    , markBonified = false;

  return {
    findAll: function (opts, cb) {
      var owner = opts.user.username;
      wrap.connect(function (err, db) {
        if (err) return cb(err);
        db.collection(colName)
          .find({owner: owner, active: true})
          .sort({name: 1, sizeSort: 1})
          .toArray(function (err, data) {
            if (err) return cb(err);
            cb(null, data);
          });
      });
    },
    findById: function (opts, cb) {
      var owner = opts.user.username
        , id    = opts.id;

      wrap.connect(function (err, db) {
        if (err) return cb(err);
        db.collection(colName)
          .find({owner: owner,
            active: true,
            _id: wrap.ObjectID(id)})

          .toArray(function (err, doc) {
            if (err) return cb(err);
            cb(null, doc);
          });
      });
    },
    update: function (opts, cb) {
      // update existing image
      var owner = opts.user.username
        , id    = opts.id
        , image = opts.image;

      console.log('id: ' + id);
      console.dir(image);

      delete image._id; // not updating _id
      if (markBonified) image.bonified = true;

      wrap.connect(function (err, db) {
        if (err) return cb(err);
        db.collection(colName)
          .update({_id: wrap.ObjectID(id) },
          {'$set': image}, {safe: true, multi: false}, function (err, results) {
            if (err) return cb(err);

            var code = results === 1 ? {success: true} : {success: false};
            cb(null, code);
          });
      });
    },
    // save new image
    save: function (opts, cb) {
      var owner = opts.user.username
        , id    = opts.id
        , image = opts.image;

      if (markBonified) image.bonified = true;
      image.owner = owner;

      wrap.connect(function (err, db) {
        if (err) return cb(err);
        db.collection(colName)
          .insert(image, {safe: true}, function (err, result) {
            if (err) return cb(err);

            var code = result === 1 ? {success: true} : {success: false};
            cb(null, code);
          });
      });
    },
    delete: function (opts, cb) {
      var owner = opts.user.username
        , id = opts.id;

      wrap.connect(function (err, db) {
        if (err) return cb(err);
        db.collection(colName)
          .remove({_id: wrap.ObjectID(id),
            owner: owner}, function (err, results) {
            if (err) return cb(err);

            var code = results === 1 ? {result: true} : {result: false};
            cb(null, code);
          });
      });
    }
  }; // end return block
};