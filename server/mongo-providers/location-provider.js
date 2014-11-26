var collectionName = 'locations';
var async = require('async');
var printTools = null;
var wrap = null;

module.exports = function(mongoWrap){ 'use strict';

  wrap = mongoWrap;
  printTools = require('./print-tools')(wrap);

  return {

    findAll: function (opts, cb) {
      var query = {
        collection: collectionName,
        where: {owner : opts.owner},
        sort:  {location: 1}
      };
      wrap.findAll(query, function(err, results) {
        if(err) return cb(err);
        cb(null, results);
      });
    },
    findById: function (opts, cb) {
      opts.collection = collectionName;
      wrap.findById(opts, function(err, doc) {
        if(err) cb(err);
        cb(null, doc);
       });
    },
    // save new location
    insert: function (opts, cb) {
      opts.collection = collectionName;
      opts.data.owner = opts.owner; // locations are owner keyed

      wrap.insert(opts, function(err, result) {
        if(err) return cb(err);
        cb(null, result);
      });
    },
    // update existing location by id
    update: function (opts, cb) {
      opts.collection = collectionName;

      // used in series update logic
      var states = {
        location: {
          new: opts.data.location,
          old: null,
          change: false
        },
        commission: {
          new: opts.data.commission,
          old: null,
          change: false
        }
      };
      // return code for client
      var code = {
        success: false,
        updated: {
          locations: 0,
          prints:  0
        }
      };

      // -----------------------------------------------------------
      // Update prints where
      //  - location.location (name) has changed
      //  - location.commission has changed - re-compute costs and margins via printTools -> printUtils
      async.series({
        // determine what has changed in this update
        getLocationChange: function(cb){
          // fetch existing (old) location for comparison to input (new)
          wrap.findById({collection: opts.collection, id: opts.id}, function (err, doc) {
            if (err) return cb(err);
            // was the location name changed
            if( doc.location !== states.location.new ){
              states.location.old = doc.location;
              states.location.change = true;
            }
            // was the commission changed
            if( doc.commission !== states.commission.new ){
              states.commission.old = doc.commission;
              states.commission.change = true;
            }
            cb(null, states);
          });
        },
        updatePrintLocation: function (cb){
          // update the location in the prints that are assigned to the old location
          if(states.location.change){
            wrap.db.collection('prints')
                // find old location name and update those documents
                .update({location: states.location.old, owner: opts.owner},
                        {'$set': {location: states.location.new}},
                        {w: 1, upsert: false, multi: true}, function (err, result) {
                  if (err) return cb(err);
                  code.updated.prints = result;
                  cb(null, result);
              });
          } else {
            cb(null);
          }
        },
        updateLocation: function (cb) {
          // update this location itself
          wrap.updateById(opts, function(err, result) {
            if(err) return cb(err);
            code.success = true;
            code.updated.locations = 1;
            cb(null, result);
          });
        },
        updatePrintPricing: function(cb){
          if(states.commission.change === true){
            // make reasonable sure everything is saved
            process.nextTick(function() {
              printTools.prepPrints({location: states.location.new, owner: opts.owner}, function(err, totalProcessed) {
                if(err) return cb(err);
                if(code.updated.prints === 0) code.updated.prints = totalProcessed;
                cb(null, totalProcessed);
              });
            });
          } else {
            cb(null);
          }

        } // finished series
      }, function(err, results){
        // completion or failure of print updates
        // cb is from main routine entry
        if(err) return cb(err);
        cb(null, code);
      }); // done async.series (related print updates)
    },
    // delete location by id
    delete: function (opts, cb) {
      opts.collection = collectionName;
      wrap.removeById(opts, function(err, code) {
        if(err) return cb(err);
        cb(null, code);
      });
    },
    findPrintTotals: function(opts, cb) {
      /*
      Extended aggregate routine
        -- merges "location" totals from "prints" collection
      */
      var query = {
        collection: collectionName,
        where     : {owner: opts.owner}
      };
      // cross collection aggregation using JS
      wrap.connect(function (err, db) {
        if (err) return cb(err);
        // get all locations for owner
        wrap.findAll(query, function (err, locations) {
          if (err) return cb(err);
          // get all location totals from print collection
          db.collection('prints').aggregate([
            {$match: query.where },
            {$group: {
              _id: '$location',
              total: {"$sum": 1}
            }}
          ], function (err, totals) {
            if (err) return cb(err);
            // merge print totals into each location
            locations.forEach(function(location) {
              var found = false;
              totals.forEach(function(total) {
                if(total._id === location.location){
                  found = true;
                  location.total = total.total;
                }
              });
              if(! found) {
                location.total = 0;
              }
            });
            cb(null, locations);
          });
        });
      });
    }
  }; // end return block
};

/*
var locationUpdate = {
  getLocationChange: function(states, opts, callback){ 'use strict';

    wrap.findById({collection: opts.collection, id: opts.id}, function (err, doc) {
      if (err) return callback(err);
      // see if the location name is modified in this update
      if( doc.location !== states.location.new ){
        states.location.old = doc.location;
        states.location.change = true;
      }
      if( doc.commission !== states.commission.new ){
        states.commission.old = doc.commission;
        states.commission.change = true;
      }
      callback(null, states, opts);
    });
  },
  updatePrintLocation: function (states, opts, callback){ 'use strict';
    callback(null, states, opts);
  },
  updatePrintPricing: function(states, opts, callback){
    console.log('updatePrintPricing()');
    console.dir(states);
    callback(null, states, opts, callback);
  },
  
  updateLocation: function (states, opts, callback) {
    console.log('updateLocation()');
    console.dir(states);
    callback(null, states, opts, callback);
  }
};
*/


/*
wrap.connect(function (err, db) {
  if (err) return cb(err);
  db.collection(opts.collection)
    .findOne( { _id: wrap.ObjectID(opts.id)}, function (err, doc) {
      wrap.show(doc);
      if (err) return cb(err);
      cb(null, doc);
    });
});
*/