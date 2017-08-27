module.exports = function(mongoWrap){ 'use strict';
  var printUtils = require('./print-utils')(mongoWrap)
    , wrap = mongoWrap
    , collectionName = 'prints';

  return {
    // return all prints
    findAll: function (opts, cb) {
      var query = {
        collection : collectionName,
        where : {
          owner: opts.owner
          //active: true
        },
        sort : {
          name: 1,
          sizeSort: 1
        }
      };
      //console.log('prints::findAll()'); wrap.show(query);

      wrap.findAll(query, function(err, results) {
        if(err) return cb(err);
        cb(null, results);
      });
    },
    // find individual print by id
    findById: function (opts, cb) {
      opts.collection = 'prints';
      wrap.findById(opts, function(err, doc) {
        if(err) cb(err);
        cb(null, doc);
      });
    },
    // save new or cloned print
    insert: function (opts, cb) {
      opts.collection = collectionName;
      opts.data.owner = opts.owner;
      opts.data.acvtive = true;
      //console.log('Pre prep: '); wrap.show(opts.data);

      printUtils.prepNewPrint(opts.data);
      printUtils.prepPrint(opts.data, function(err, prepPrint) {
        if (err) return cb(err);
        //if(err) return console.log(err);
        //console.log('Post prep:'); console.dir(opts.data);
        wrap.insert(opts, function(err, result) {
          if(err) return cb(err);
          cb(null, result);
        });
      });
    },
    // update existing print
    update: function (opts, cb) {
      opts.collection = 'prints';
      opts.data.owner = opts.owner;

      // console.log('Pre prep: ');wrap.show(opts.data);

      printUtils.prepPrint(opts.data, function(err, prepPrint) {
        if (err) return cb(err);
        //if(err) return console.log(err);
        //console.log('Post prep:'); console.dir(opts.data);

        wrap.updateById(opts, function(err, code) {
          if(err) return cb(err);
          //updateStatus(opts, function(err, cb) {
          cb(null, code);
          //});
        });
      });
    },
    // delete a print by its id
    delete: function (opts, cb) {
      opts.collection = collectionName;
      wrap.removeById(opts, function(err, code) {
        if(err) return cb(err);
        cb(null, code);
      });
    },
    // REST Call to massage print object, with price, cost commission, etc
    prepPrint: function(print, cb) {
      printUtils.prepPrint(print, function(err, print) {
        if(err) return cb(err);
        cb(null, print);
      });
    }
  }; // end return block

  function updateStatus(opts, cb){
    var isoDate = wrap.todayAsISODate();

    wrap.findById(opts, function(err, print) {
      if(err) return cb(err);
      if(! print.history){
       var history = [{status: opts.status, date: isoDate}];
      } else {
        if(print.history.length && print.history.length > 0){
          if(print.history[0].status !== opts.status){
            print.history.push({status: opts.status, date: isoDate });
          }
        }
      }
    });
  }


};