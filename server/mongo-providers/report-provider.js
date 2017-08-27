var _     = require('underscore')
  , async = require('async');

module.exports = function(mongoWrap){ 'use strict';

  var priceMatrix = {};
  var wrap = mongoWrap;
  var yearReg = /(\d{4})/;
  var monthReg = /($\d{2})/;
  var dateReg = /-(\d{2})-/;

  return {
    // reports/simple/printSalesList
    printSoldList: function (opts, cb) {
      var totalRevenue = 0, totalCost = 0, totalCommission = 0, totalProfit = 0;
      var query = {
        collection: 'prints',
        where: {status:'Sold-Received', owner: opts.owner},
        sort: {date: -1, location: 1}
      };
      wrap.findAll(query, function(err, data) {
        if(err) return cb(err);
        var total = 0;
        for (var i = 0; i < data.length; i++) {
          var item = data[i];
          totalRevenue    += item.price.price;
          totalCost       += item.price.cost;
          totalCommission += item.price.commission;
          totalProfit     += item.price.profit;
        }
        var results = {
          totalRevenue:    totalRevenue,
          totalCost:       totalCost,
          totalCommission: totalCommission,
          totalProfit:     totalProfit,
          data:            data
        };
        cb(null, results);
      });
    },
    latestStatusChanges: function(opts, cb) {
      var query = {
        collection: 'prints',
        where: {owner: opts.owner},
        sort: {date: -1, location: 1}
      };
      wrap.db
        .collection(query.collection)
        .find(query.where)
        .limit(300)
        .sort(query.sort)
        .toArray(function (err, doc) {
          if(err) return cb(err);
          cb(null, {data: doc});
        });
    },
    printTotalsByLocation: function(opts, cb) {
      wrap.connect(function(err, db) {
        if (err) return cb(err);

        var prints = db.collection('prints');
        var query = {owner: opts.owner, status: {$nin: ['Hold', 'Sold-Received', 'Sold-Pending']}};

        prints.find(query).count(function (err, count) {
          if (err) return cb(err);
          var grandTotalCount = count;

          prints.aggregate ({$match: query},
            {$group: {_id: '$location', totalCount: {$sum: 1},
                                        totalPrice: {$sum: '$price.price'},
                                        totalCost:  {$sum: '$price.cost'}}},
            function(err, data) {
              if (err) return cb(err);

              cb(null, {
                data: data,
                grandTotalCount: grandTotalCount
              });
          });
        });
      });
    },
    printTotalsByStatus: function(opts, cb){
      var prints = wrap.db.collection('prints');
      var query = {owner: opts.owner, status: {$nin: ['Hold', 'Sold-Received', 'Sold-Pending']}};
      prints.find(query).count(function(err, count) {
        if (err) return cb(err);
        var grandTotalCount = count;
        prints.aggregate({$match: query},
          {$group: {_id: '$status', totalCount: {$sum: 1},
                                    totalPrice: {$sum: '$price.price'},
                                    totalCost:  {$sum: '$price.cost'}
          }},
          {$sort: {totalCount: -1}}
          , function (err, data) {
            if (err) return cb(err);
            cb(null, {
              data: data,
              grandTotalCount: grandTotalCount
            });
          }
        );
      });
    },
    saleTotalsByLocation: function(opts, cb) {
      var query = {owner: opts.owner, status:'Sold-Received'};
      var grandTotalCount = 0;

      var prints = wrap.db.collection('prints');
      prints.find(query).count(function(err, count) {
        if(err) return cb(err);
        grandTotalCount = count;

        prints.aggregate({$match: query},
          {$group:{_id: '$location', totalCount: {$sum: 1},
            totalCost:    {$sum: '$price.cost'},
            totalPrice:   {$sum: '$price.price'},
            totalProfit:  {$sum: '$price.profit'},
            avgNetMargin: {$avg: '$price.netMarginPercent'}}},
          {$sort: {totalCount: -1}}

          ,function(err, data) {

            if(err) return cb(err);
            cb(null, {
              grandTotalCount: grandTotalCount,
              data: data
            });
          });
      });
    },
    saleTotalsByImage: function(opts, cb) {
      var query = {owner: opts.owner, status:'Sold-Received'};
      var grandTotalCount = 0;

      var prints = wrap.db.collection('prints');
      prints.find(query).count(function(err, count) {
        if(err) return cb(err);
        grandTotalCount = count;
        prints.aggregate({$match: query},
          {$group:{_id: '$name', totalCount:   {$sum: 1},
                                 totalCost:    {$sum: '$price.cost'},
                                 totalPrice:   {$sum: '$price.price'},
                                 totalProfit:  {$sum: '$price.profit'},
                                 avgNetMargin: {$avg: '$price.netMarginPercent'}}},
          {$sort: {totalCount: -1}}

          ,function(err, data) {

            if(err) return cb(err);
            cb(null, {
              grandTotalCount: grandTotalCount,
              data: data
            });
          });
      });
    },
    saleTotalsBySize: function(opts, cb) {
      var query = {owner: opts.owner, status:'Sold-Received'};
      var grandTotalCount = 0;

      var prints = wrap.db.collection('prints');
      prints.find(query).count(function(err, count) {
        if(err) return cb(err);
        grandTotalCount = count;
        prints.aggregate({$match: query},
          {$group:{_id: '$size', totalCount:   {$sum: 1},
                                 totalCost:    {$sum: '$price.cost'},
                                 totalPrice:   {$sum: '$price.price'},
                                 totalProfit:  {$sum: '$price.profit'},
                                 avgNetMargin: {$avg: '$price.netMarginPercent'}}},
          {$sort: {totalCount: -1}}

          ,function(err, data) {

            if(err) return cb(err);
            cb(null, {
              grandTotalCount: grandTotalCount,
              data: data
            });
          });
      });
    },
    saleTotalsByYear: function(opts, cb) {
      var query = {owner: opts.owner, status:'Sold-Received'};
      var grandTotalCount = 0;

      var prints = wrap.db.collection('prints');

      prints.find(query).count(function(err, count) {
        if(err) return cb(err);
        grandTotalCount = count;

        prints.aggregate( {$match: query},
          {$group: {_id: {$year: '$date'}, totalCount:   {$sum: 1},
                                           totalCost:    {$sum: '$price.cost'},
                                           totalPrice:   {$sum: '$price.price'},
                                           totalProfit:  {$sum: '$price.profit'},
                                           avgNetMargin: {$avg: '$price.netMarginPercent'}}},
          {$sort: {_id: 1}}
          ,function(err, data) {
            if(err) return cb(err);
            wrap.show(data);
            cb(null, {
              grandTotalCount: grandTotalCount,
              data: data
            });
          });
      });
    },
    saleTotalsByMonth: function(opts, cb) {
      var query = {owner: opts.owner, status:'Sold-Received'};
      var grandTotalCount = 0;

      var prints = wrap.db.collection('prints');

      prints.find(query).count(function(err, count) {
        if(err) return cb(err);
        grandTotalCount = count;

        prints.aggregate( {$match: query},
          {$group: {_id: {$month: '$date'}, totalCount:   {$sum: 1},
                                            totalCost:    {$sum: '$price.cost'},
                                            totalPrice:   {$sum: '$price.price'},
                                            totalProfit:  {$sum: '$price.profit'},
                                            avgNetMargin: {$avg: '$price.netMarginPercent'}}},
          {$sort: {_id: 1}}
          ,function(err, data) {
            if(err) return cb(err);
            wrap.show(data);
            cb(null, {
              grandTotalCount: grandTotalCount,
              data: data
            });
          });
      });
    },

    saleTotalsByYearAndMonth: function(opts, cb) {
      var query = {owner: opts.owner, status:'Sold-Received'};
      var grandTotalCount = 0;
      var prints = wrap.db.collection('prints');

      prints.find(query).count(function(err, count) {
        if(err) return cb(err);
        grandTotalCount = count;
        prints.aggregate( {$match: {'status':/Sold-Received/}},
                          {$group:{ _id:{year: {$year: '$date'} , month: {$month: '$date'}},
                                totalCount:   {$sum: 1},
                                totalCost:    {$sum: '$price.cost'},
                                totalPrice:   {$sum: '$price.price'},
                                totalProfit:  {$sum: '$price.profit'},
                                avgNetMargin: {$avg: '$price.netMarginPercent'}}},
                          {$sort:{'_id.year': 1, '_id.month':1}},

          function(err, data) {
            if(err) return cb(err);
            wrap.show(data);
            cb(null, {
              grandTotalCount: grandTotalCount,
              data: data
            });
          });
      });
    },
    systemTotals: function(opts, cb) {
      var totals = {
        images: 0,
        prints: 0,
        locations: 0,
        leads: 0,
        sold: 0,
        printsByLocation : {},
        leadsByInterest: {}
      };

      async.series({
        images: function(callback) {
          var query = {owner: opts.owner, active: true};
          wrap.db.collection('images')
            .find(query)
            .count(function(err, count) {
              if(err) callback(err);
              totals.images = count;
              callback(null);
            });
        },
        prints: function(callback) {
          var query = {owner: opts.owner, status: {$in: ['On Display', 'Back Stocked', 'In Storage']}};
          wrap.db.collection('prints')
            .find(query)
            .count(function(err, count) {
              if(err) callback(err);
              totals.prints = count;
              callback(null);
            });
        },
        sold: function(callback) {
          var query = {owner: opts.owner, status: {$in: ['Sold-Received']}};
          wrap.db.collection('prints')
            .find(query)
            .count(function(err, count) {
              if(err) callback(err);
              totals.sold = count;
              callback(null);
            });
        },
        leads: function(callback) {
          var query = {owner: opts.owner};
          wrap.db.collection('leads')
            .find(query)
            .count(function(err, count) {
              if(err) callback(err);
              totals.leads = count;
              callback(null);
            });
        },
        locations: function(callback) {
          var query = {owner: opts.owner, displaying: true};
          wrap.db.collection('locations')
            .find(query)
            .count(function(err, count) {
              if(err) callback(err);
              totals.locations = count;
              callback(null);
            });
        },
        printsByLocation: function (callback) {
          var query = {owner: opts.owner, status: {$nin: ['Hold', 'Sold-Received', 'Sold-Pending']}};
          wrap.db.collection('prints')
            .aggregate({$match: query},
            {$group: {_id: '$location', totalCount: {$sum: 1}}},
            {$sort: {_id: 1}}, function (err, results) {
              if (err) return callback(err);
              totals.printsByLocation = results;
              callback(null);
            });
        },
        leadsByInterest: function (callback) {
            var query = {owner: opts.owner};
            wrap.db.collection('leads')
              .aggregate({$match: query},
              {$group: {_id: '$interest', total: {$sum: 1}}},
              {$sort: {_id: 1}}, function (err, results) {
                if (err) return callback(err);
                totals.leadsByInterest = results;
                callback(null);
              });
          }
        }, function(err){
          if(err) return cb(err);
          wrap.show(totals);
          cb(null, totals);

      }); // end async.series
    } // end systemTotals

  }; // end return block
};
