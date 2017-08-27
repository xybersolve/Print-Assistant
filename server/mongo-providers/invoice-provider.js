var async = require('async');

module.exports = function(mongoWrap){ 'use strict';

  var wrap = mongoWrap;

  return {
    invoice: function(opts, cb) {
      /*
        Passes in all Prints in inventory and builds report on _ids
      */
      wrap.show(opts);

      var owner = opts.owner
        , location = opts.data.location
        , status = opts.data.status
        , inventory = opts.data.inventory
        , inventoryIds = []
        , results = {
            user: null,
            prints: null,
            client: null,
            today: new Date()
      };

      for (var i = 0; i < inventory.length; i++) {
        inventoryIds.push(wrap.ObjectId(inventory[i]));
      }
      async.series({
        getPrints: function(callback) {
          wrap.db.collection('prints')
            .find({_id: {$in: inventoryIds}})
            .sort({name: 1, sizeSort: 1})
            .toArray(function(err, data) {
              if(err) return callback(err);
              var count = 1;
              var total = 0;
              data.forEach(function(item) {
                item.index = count++;
                item.bgColor = (count % 2) ? '#d5d5d5' : '#ffffff';
                total += item.price.price;
              });
              results.prints = data;
              results.total = total;
              wrap.show(results.prints);
              callback(null);
            });
        },
        getUser: function(callback) {
          fetchUser(owner, function(err, user) {
            if(err) return callback(err);
            results.user = user;
            callback(null);
          });
        },
        getClient: function(callback) {
          fetchClient(owner, location, function(err, client) {
            if(err) return callback(err);
            results.client = client;
            callback(null);
          });
        }
      }, function(err, data) {
        if(err) return cb(err);
        wrap.show(results);
        cb(null, results);
      });
    },
    reconcile: function(opts, cb){
      /*
      Passes in array of remaining print _ids, builds reconcile report using them
      */
      var owner = opts.owner
        , location = opts.data.location
        , remaining = opts.data.remaining
        , remainingIds = []
        , results = {
            user: null,
            prints: null,
            client: null,
            today: new Date()
        };

      for (var i = 0; i < remaining.length; i++) {
        remainingIds.push(wrap.ObjectId(remaining[i]));
      }
      async.series({
        getRemaining: function(callback) {
          wrap.db.collection('prints')
            .find({_id: {$in: remainingIds}})
            .sort({date: -1, name: 1, sizeSort: 1})
            .toArray(function (err, data) {
              if(err) return callback(err);
              var count = 1;
              var total = 0;
              data.forEach(function(item) {
                item.index = count++;
                item.bgColor = (count % 2) ? '#d5d5d5' : '#ffffff';
                total += item.price.price;
              });
              results.prints = data;
              results.total = total;
              callback(null);
            });
        },
        getUser: function(callback) {
          fetchUser(owner, function(err, user) {
            if(err) return callback(err);
            results.user = user;
            callback(null, results);
          });
        },
        getClient: function(callback) {
          fetchClient(owner, location, function(err, client) {
            if(err) return callback(err);
            results.client = client;
            callback(null);
          });
        }

      }, function(err, data) {
          if(err) return cb(err);
          wrap.show(results);
          cb(null, results);
      });
    },
    yearEndInventory: function(opts, cb) {
      var owner = opts.owner;
      // null year means sales over all time
      var year = opts.data.year;
      var results = {
        user: null,
        today: new Date(),
        year: year === null ? 'All Sales' : year,
        data: null,
        totals: null,
        sales: {}
      };
      async.series({
        getInventory: function(callback) {
          var query = {
            owner: owner,
            status: {$in:['On Display', 'In Storage', 'Back Stocked', 'In Transit']}
          };
          wrap.db.collection('prints')
            .aggregate({$match: query},
            {$group: {_id: '$status', totalCount: {$sum: 1},
              totalPrice: {$sum: '$price.price'},
              totalCost: {$sum: '$price.cost'}}},
            {$sort: {_id: 1}},
            function (err, data) {
              if (err) return cb(err);
              var totals = {
                count: 0,
                price: 0,
                cost: 0
              };

              var grandTotal = 0;
              for (var i = 0; i < data.length; i++) {
                var item = data[i];
                totals.count += item.totalCount;
                totals.price += item.totalPrice;
                totals.cost += item.totalCost;
              }
              results.totals = totals;
              results.data = data;

              callback(null);
            });
        },
        getSales: function (callback) {
          //var now = new Date();
          //var year = now.getFullYear();
          var query = {
            owner: owner,
            status: {$in: ['Sold-Received']}
          };
          // if year -- query for this years date range
          if(year !== null){
            var startDate = new Date(year, 0, 1);
            var endDate = new Date(year, 11, 31);
            query.date = {$gt: startDate, $lte: endDate};
          }

          wrap.db.collection('prints')
              .aggregate({$match: query},
                         {$group: {_id: '$location', totalCount: {$sum: 1},
                                                     totalPrice: {$sum: '$price.price'},
                                                     totalCost: {$sum: '$price.cost'},
                                                     totalCommission: {$sum: '$price.commission'},
                                                     totalProfit: {$sum: '$price.profit'},
                                                     totalNetMargin: {$sum: '$price.netMargin'},
                                                     avgNetMarginPercent: {$avg: '$price.netMarginPercent'}}},
                         {$sort: {_id: 1}},

              function (err, data) {
                  if (err) return cb(err);

                var totals = {
                  count: 0,
                  price: 0,
                  cost: 0,
                  commission: 0,
                  profit: 0,
                  netMargin: 0,
                  marginPercent: 0
                };
                var grandTotal = 0;
                for (var i = 0; i < data.length; i++) {
                  var item = data[i];
                  totals.count += item.totalCount;
                  totals.price += item.totalPrice;
                  totals.cost += item.totalCost;
                  totals.commission += item.totalCommission;
                  totals.profit += item.totalProfit;
                  totals.netMargin += item.totalNetMargin;
                  item.avgNetMarginPercent = Math.floor(item.avgNetMarginPercent);
                  totals.marginPercent += Math.floor(item.avgNetMarginPercent);
                }
                totals.marginPercent = Math.floor(totals.marginPercent / data.length);
                results.sales.totals = totals;
                results.sales.data = data;

                 callback(null);
              });
          },
          getUser: function (callback) {
            fetchUser(owner, function (err, user) {
              if (err) return callback(err);
              results.user = user;
              results.client = user;

              callback(null);
            });
        }
      }, function(err, data) {
        if(err) return cb(err);
        wrap.show(results);
        cb(null, results);
      });


      /*
      wrap.db.collection('prints')
          .find(query, {status: true, date: true, name: true, size: true})
          .sort({status: 1, name:1, sizeSort:1})
          .toArray(function(err, docs) {
          if(err) return console.log(err);
          //if(err) return cb(err);
          wrap.show(docs);
          cb(null, docs);
        });
      */
    }
  }; // end return block
  /*************************************************

  Common Shared Invoice Routines

  */
  function fetchUser(owner, cb){
    wrap.db.collection('users')
      .find({username: owner})
      .toArray(function(err, data) {
        if(err) return callback(err);
        if(data.length !== 1){
          cb(new Error('Got more or less than one user back!'));
        } else {
          var user = data[0];
          if(user.password) delete user.password;
          cb(null, user);
        }
      });
  }
  function fetchClient(owner, location, cb){
    wrap.db.collection('locations')
      .findOne({location:location, owner:owner}, function(err, data) {
        if(err) return cb(err);
        cb(null, data);
      });
  }


};