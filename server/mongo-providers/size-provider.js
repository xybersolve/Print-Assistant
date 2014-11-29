module.exports = function(mongoWrap){ 'use strict';

  var wrap = mongoWrap
    , collectionName = 'sizes';

  return {
    findAll: function (opts, cb) {
      var query = {
        collection: collectionName,
        where:{},
        sort: {ratio:1, size: 1}
      };
      wrap.findAll(query, function(err, results){
        if(err) return cb(err);
        cb(null, results);
      });
    }

  }; // end return block
};