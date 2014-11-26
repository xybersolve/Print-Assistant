module.exports = function(mongoWrap){ 'use strict';

  var wrap = mongoWrap
    , collectionName = 'materials';

  return {

    findAll: function (opts, cb) {
      var query = {
        collection: collectionName,
        where: {},
        sort: {}
      };
      wrap.findAll(query, function(err, results){
        if(err) return cb(err);
        cb(null, results);
      });
      /*
      wrap.connect(function (err, db) {
        if (err) return cb(err);
        db.collection(colName)
          .find({})
          .sort({material: 1})
          .toArray(function (err, data) {
            if (err) return cb(err);
            cb(null, data);
          });
      });*/
    }

  }; // end return block
};