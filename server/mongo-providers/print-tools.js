module.exports = function(dbWrap) { 'use strict';
  var wrap = dbWrap;
  var provider = require('./print-provider')(dbWrap);
  var printUtils = require('./print-utils')(dbWrap);
  var prints = [];
  var callback = null;
  var totalProcessed = 0;

  return {
    prepPrints: prepPrints
  };

  function prepPrints(query, cb){
    if(cb) callback = cb;
    wrap.db.collection('prints')
      .find(query)
      .toArray(function(err, preps) {
        if(err){
          if(callback) return callback(err);
          return console.log(err);
        }
        prints = preps;
        prepNextPrint();
      });
  }
  function prepNextPrint(){
    if(prints.length > 0) {
      totalProcessed++;
      var print = prints.pop();
      console.log('prints left: ' + prints.length + ', processed: ' + totalProcessed);
      printUtils.prepPrint(print, function (err, result) {
        if(err){
          if(callback) return callback(err);
          return console.log(err);
        }
        var opts = {
          id:    print._id,
          data:  print,
          owner: print.owner
        };
        provider.update(opts, function(err, code) {
          if(err){
            if(callback) return callback(err);
            return console.log(err);
          }
          console.dir( code );
          prepNextPrint();
        });
      });
    } else {
      if(callback !== null ) callback(null, totalProcessed);
      callback = null;
    }
  }

};  
