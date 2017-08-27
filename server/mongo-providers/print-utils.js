module.exports = function(dbWrap) { 'use strict';
  var wrap = dbWrap;
  var prints = [];
  var defaultLocation = 'Default';

  return {
    prepPrint: prepPrint,     // preps all including pricing
    prepPricing: prepPricing,  // preps pricing only
    prepNewPrint: prepNewPrint
  };
  // --------------------------------------------------
  //  Facade Routine
  //
  function prepPrint(print, cb) {

    computeVolume(print);
    recordStatus(print);
    prepPricing(print, function(err, print) {
      if(err) return cb(err);
      setDates(print);
      cb(null, print);
    });
  }
  function prepPricing(print, cb){

    // size and material are required for pricing matrix lookup
    if(! exists(print, 'size') || ! exists(print, 'material') ) return cb(null, print);

    updatePrices(print, function(err) {
      if(err) return cb(err);
      updateCommission(print, function (err) {
        if(err) return cb(err);
        updateProfit(print, function(err) {
          if(err) return cb(err);
          cb(null, print);
        });
      });
    });
  }
  function prepNewPrint(print){
    // print preparations before save
    //delete existing id if it exists
    if(print._id) delete print._id;
    // in case clone  - delete existing history
    print.history = [];
    // new print should not be frozen
    print.frozen = false;
    // new print will date from today
    if(! print.date) print.date = new Date();
  }

  function computeVolume(print) {
    // determines print volume based on width and height
    // stores back to print object as "volume" & "sizeSort"
    // find: (8)x(12) | 8 * 12 = 96
    var pattern = /(\d{1,2})/g;
    if ( print.hasOwnProperty('size') ) {
      var size = print.size;
      var matches = size.match(pattern);
      if (matches && matches.length > 0) {
        var smaller = matches[0];
        var taller = matches[1];
        var sizeSort = parseInt(smaller, 10) * parseInt(taller, 10);
        print.sizeSort = sizeSort;
        print.volume = sizeSort;
      }
    }
  }

  function setDates(print){
    // insure dates are all JS Date objects
    if(print.date){
      print.date = new Date(print.date);
    } else {
      print.date = new Date();
    }
    if(print.history && print.history.length > 0) {
      for (var i = 0; i < print.history.length; i++) {
        print.history[i].date = new Date([print.history[i].date]);
      }
    }
    if(print.saleDate){
      print.saleDate = new Date(print.saleDate);
    }
    // finally set the update date to today
    print.lastUpdated = new Date();
  }

  function ISODateToJSDate(date){
    return new Date(date);
  }
  function todayAsISODate() {
    return new Date().toISOString();
  }
  // --------------------------------------------------
  //  Profit
  //
  function updateProfit(print, cb){
    // commissionCost = price * ( commission / 100)
    // grossMargin = price - cost;
    // grossMarginPercent = grossMargin / price * 100
    // netMargin = price - cost - commissionCost;
    // netMarginPercent = netMargin / profit * 100
    // priceProfitPercent = price / cost * 100
    // profit = netMargin

    if( isFrozen(print) ) return cb(null);

    // Require the following properties to successfully compute profit and margins
    if(! exists(print.price, 'price')) return cb(new Error('"print.price" had no "price" property'));
    if(! exists(print.price, 'cost')) return cb(new Error('"print.price" had no "cost" property'));

    if(! exists(print.priceCents, 'price')) return cb(new Error('"print.priceCents" had no "price" property'));
    if(! exists(print.priceCents, 'cost')) return cb(new Error('"print.priceCents" had no "cost" property'));

    // gross, net margin & profit
    print.price.grossMargin = print.price.price - print.price.cost;
    print.price.netMargin   = print.price.grossMargin - print.price.commission;
    print.price.profit      = print.price.netMargin;

    // margin percents
    print.price.grossMarginPercent  = Math.round( ( print.price.grossMargin / print.price.price ) * 100 );
    print.price.netMarginPercent  = Math.round ( ( print.price.netMargin / print.price.price) * 100 );

    // price data in cents for precision calculations w.o. floating point math
    print.priceCents.grossMargin = print.priceCents.price - print.priceCents.cost;
    print.priceCents.netMargin = print.priceCents.grossMargin - print.priceCents.commission;
    print.priceCents.profit  = print.priceCents.netMargin;

    // margin percents
    print.priceCents.grossMarginPercent  = Math.round( ( print.priceCents.grossMargin / print.priceCents.price ) * 100 );
    print.priceCents.netMarginPercent  = Math.round ( ( print.priceCents.netMargin / print.priceCents.price) * 100 );

    cb(null);
  }
  /* Could break this out for DRY compute
  function computePricing(opts){

    if( isFrozen(print) ) return;

    if(! exists(opts, 'price')) return cb(new Error('"computePricing->opts" had no "price" property'));
    if(! exists(opts, 'cost')) return cb(new Error('"computePricing->opts" had no "cost" property'));
    if(! exists(opts, 'commissionPercent')) return cb(new Error('"computePricing->opts" had no "commissionPerecnt" property'));

    var pricing = {
      commission: opts.price * (opts.commissionPercent / 100),
      grossMargin: opts.price - opts.cost,
      netMargin: (opts.price - opts.cost) - pricing.commission,
      grossMarginPercent: Math.round( ( pricing.grossMargin / opts.price ) * 100 ),
      netMarginPercent: Math.round( ( pricing.netMargin / opts.price ) * 100 )
    };
  }
  */

  // --------------------------------------------------
  //  Price Routines
  //
  function updatePrices(print, cb) {
    // margin: price - cost
    // margin percent: margin / price * 100
    if( isFrozen(print) ) return cb(null);

    getPrices(print, function(err, prices) {
      if(err) return cb(err);

      print.price        = {};
      print.price.price  = prices.price;
      print.price.cost   = prices.cost;

      print.priceCents        = {};
      print.priceCents.price  = prices.price * 100;
      print.priceCents.cost   = prices.cost * 100;

      cb(null);
    });
  }
  function getPrices(print, cb){
    var size = print.size;
    var material = print.material;
    var sizes = wrap.db.collection('sizes');
    sizes.findOne({size: size}, function(err, data) {
      if(err) return cb(new Error('Unable to retrieve price for size: ' + size + ', material: ' + material));
      cb( null, {
        price: data.price[material],
        cost : data.cost[material]
      });
    });
  }
  // --------------------------------------------------
  //  Commission Routines
  //
  function updateCommission(print, cb) {

    if( isFrozen(print) ) return cb(null);
    //if( !exists(print, 'location') ) return cb(null);

    getCommission(print, function(err, commissionPercent) {
      if(err) return cb(err);

      print.price.commissionPercent = parseInt(commissionPercent, 10);
      print.price.commission        = Math.floor( print.price.price * (commissionPercent / 100) );

      print.priceCents.commissionPercent = parseInt(commissionPercent, 10);
      print.priceCents.commission        = Math.floor( print.priceCents.price * (commissionPercent / 100) );

      cb(null);
    });
  }
  function getCommission(print, cb){

    var locations = wrap.db.collection('locations');
    var commission = 0;
    // Some locations allow print specific commissions, these include
    //  * Commercial Buyer
    //  * Private Buyer
    //   -  enables commission and deduction for individual sales.
    if( ! exists(print, 'location')){
      // no location return zero commission
      return cb(null, 0);

    } else if(print.commissionPercent){
      // this is a private sale
      return cb(null, print.commissionPercent);

    } else {
      // otherwise commission is derived from the location the print is associated with
      var query = {location: print.location, owner: print.owner};
      locations.findOne(query, function (err, location) {
        if (err) return cb(new Error('Unable to get location for commission computation'));
        commission = location.commission || 0;
        cb(null, commission);
      });
    }
  }
  // --------------------------------------------------
  //  Status History Routines
  //   -- put current status in history,
  //        if it is unequal to last status in history
  //
  function recordStatus(print) {

    if( isFrozen(print) ) return;

    if (! exists(print, 'history')) print.history = [];

    // reinitialize status history - dev only
    //print.history = [];

    if (print.history.length === 0) {
      // first status history
      updateStatus(print);
    } else {
      // if current status is not at top of history
      // push it into the history list
      if (print.history[0].status !== print.status || print.history[0].location !== print.location) {
        updateStatus(print);
        // if new status is Sold-Received - record flat sales date
      }
    }
    // Sold Received is the last stop in the status
    // safe to reset to date as date is updated
    if(print.status === 'Sold-Received'){
      // flatten out to primary collection level
      print.saleDate = new Date(print.date);
    }

  }
  function updateStatus(print) {
    /*
      Pulls print status and puts it in history array
        -- the actual status to history rotuine
    */
    var date = null;
    if(! print.date){
      date = new Date();
      print.date = date;
    } else {
      date = new Date(print.date);
    }
    print.history.unshift({status: print.status, date: date, location: print.location});
  }

  function isFrozen(print){
    var frozen = false;
    if(exists(print, 'frozen')){
      frozen = (print.frozen === true);
    }
    if(frozen === true) console.log('Print was tagged as frozen');
    return frozen;
  }

  function exists(obj, prop){
    return obj.hasOwnProperty(prop);
  }

};

