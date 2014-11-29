var async = require('async');

module.exports = function(mongoWrap){ 'use strict';

  var wrap = mongoWrap;

  return {
    invoice: function(opts, cb) {
      var owner = opts.owner
        , location = opts.data.location
        , status = opts.data.status
        , results = {
            user: null,
            prints: null,
            client: null
      };
      async.series({
        getPrints: function(callback) {
          var query = {
            owner: owner,
            status: {$in: status},
            location: location
          };
          wrap.db.collection('prints')
            .find(query)
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
              callback(null);
            });
        },
        getUser: function(callback) {
          wrap.db.collection('users')
            .find({username: owner})
            .toArray(function(err, data) {
              if(err) return callback(err);
              if(data.length !== 1){
                callback(new Error('Got more or less than one user back'));
              } else {
                var user = data[0];
                if(user.password) delete user.password;
                results.user = user;
                callback(null);
              }
            });
        },
        getClient: function(callback) {
          wrap.db.collection('locations')
            .findOne({location:location, owner:owner}, function(err, data) {
              if(err) return callback(err);
              if(data.location) data.name = data.location;
              results.client = data;
              callback(null);
            });
        }
      }, function(err, data) {
        if(err) return cb(err);
        cb(null, results);
      });
    },
    yearEndInventory: function(opts, cb) {

      wrap.show(opts);
      var owner = opts.owner;
      //var startDate = new
      var now = new Date();
      //var year = now.getFullYear();
      //var startDate = new Date(opts.data.year, 0, 1);
      //var endDate = new Date(opts.data.year, 11, 31);
      var query = {
        owner: opts.owner,
        //saleDate: {$gte: startDate, $lte: endDate},
        status: {$in:['On Display', 'In Storage']}
      };
      //{$sort:{_id: 1}}
      wrap.db.collection('prints')
        .aggregate({$match: query},
                   {$group:{_id: '$status', totalCount:{$sum: 1},
                                            totalPrice:{$sum: '$price.price'},
                                            totalCost: {$sum: '$price.cost'},
                                            totalGrossMargin: {$sum: '$price.grossMargin'},
                                            avgGrossMarginPercent: {$avg: '$price.grossMarginPercent'}}},
                   {$sort:{_id: 1}},
        function(err, data) {
          if(err) return cb(err);
          var totals = {
            count: 0,
            price: 0,
            cost: 0,
            margin: 0,
            marginPercent: 0
          };

          var grandTotal = 0;
          for (var i = 0; i < data.length; i++) {
            var item = data[i];
            totals.count += item.totalCount;
            totals.price += item.totalPrice;
            totals.cost += item.totalCost;
            totals.margin += item.totalGrossMargin;
            totals.marginPercent += item.avgGrossMarginPercent;
            item.avgGrossMarginPercent = Math.floor(item.avgGrossMarginPercent);
          }
          totals.marginPercent = Math.floor(totals.marginPercent / data.length);
          data.totals = totals;

          wrap.show(data);
          cb(null, data);
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
};