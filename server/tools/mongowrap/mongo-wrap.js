/****************************************
 Copyright (c) 2013 XyberSolve, Corp

  @Class: MongoWrap(config)
    -- purpose: provide wrapper to native MongoDB driver
    -- persists authenticated connection to db
    -- supports generic REST calls

  @param: config {  ** required **
    "mongo": {
      "username": "username",  [String]
      "password": "password",  [String]
      "database": "database",  [String]
      "host"    : "localhost", [String]
      "port"    : "27017",     [String]
    }
  }
******************************************/

function MongoWrap(config){ 'use strict';
  var util        = require('util')
     ,mongo       = require('mongodb')
     ,Server      = mongo.Server
     ,MongoDB     = mongo.Db
     ,isConnected = false;

  var serverOptions = {
    auto_reconnect: true,
    poolSize: 5,
    //w: 1,
    //fsynch: true
    socketOptions: {
      keepAlive: 1,
      noDelay: true,
      connectTimeoutMS: 5000
      //socketTimeoutMS: 30000
    }
  };
  // BEGIN Interface Methods
  // exposed on api
  this.db       = null;
  this.BSON     = mongo.BSONPure;
  this.ObjectID = mongo.ObjectID;
  this.ObjectId = mongo.ObjectID;
  //this.ISODate  = mongo.ISODate;

  /****************************************
  //  Main DB Connect Routine
  //   -- persists connection (reuses)
  //
  // Wrapper entrance -- passes in "db" instance
  //
  //   dbWrap.connect(function(err, db){
  //      app.listen(PORT)
  //   });
  //
  ******************************************/
  this.connect = function(cb) {
    if(isConnected !== true){
      this._connect(function(err, db){
        if(err) cb(err);

        cb(null, db);
      });
    } else {
      cb(null, this.db);
    }
  };
  this.close = function() {
    isConnected = false;
    this.db.close();
  };

  /****************************************
  BEGIN Generic DB Manipulation Routines

 Generic call wrapper routines, include:
  @method: findAll
  @method: findById
  @method: insert
  @method: updateById
  @method: removeById

  ------------------------------------------
  @method: findAll(query, callback);
    -- GET /
  @param {Object}
    query = {
      collection: 'collectionName', [String]
      where: {} || {field: where, field: where} [Object]
      sort: {} || null [Object]
    }
  @param {Function} callback(err, results)
  @return {Object} err
  @return {Array} results -document array
  @syntax:

    var query = {
      collection: @collection,
      where: {},
      sort: {}
    }
    wrap.findAll(query, function(err, results){
      if(err) return cb(err);
      if(results){...}
    });

  ***************************************/
  this.findAll = function(query, cb) {
    this.connect(function (err, db) {
      if (err) return cb(err);
      var cursor = db.collection(query.collection).find(query.where);
        if(query.sort) cursor.sort(query.sort);
        cursor.toArray(function (err, doc) {
          if(err) return cb(err);
          cb(null, doc);
        });
    });
  };


  /****************************************
    @method: findById(opts, callback)
      -- GET /:id
      -- find document in collection using _id
    @param {Object}
        opts = {
           collection: 'collectionName' {String}
           id: @id {String || Number}
        }
    @param {Function} callback(err, result)
    @return {Object} result(single doc)
    @syntax example

      var opts = {
        collection: @collection,
        id: @id
      }
      wrap.findById(opts, function(err, result){
        if(err) return cb(err);
        if(result) cb(null, result);
      });
  ***************************************/
  this.findById = function(opts, cb) {
    var self = this;
    self.connect(function (err, db) {
      if (err) return cb(err);
      db.collection(opts.collection)
        .findOne({_id: self.ObjectID(opts.id)},
        function (err, doc) {
          if (err) return cb(err);
          cb(null, doc);
        });
    });
  };


  /****************************************
    @method: insert(opts, callback);
      -- create new document in collection
      -- POST /:id
    @param {Object}
        opts = {
          collection: collection name {String}
          data: object to save {Object}
        }
    @param {Function} callback(err, result)
    @return {Object} result: new document
    @usage example
       var opts = {
          collection: collectionName,
          data: {}
       }
       wrap.insert(opts, function(err, result){
          if(err) return cb(err);
          if(result} cb(null, result);
       })
  ***************************************/
  this.insert = function (opts, cb) {
    this.connect(function(err, db) {
      if(err) return cb(err);
      db.collection(opts.collection)
        .insert(opts.data, {w: 1, safe: true, multi: false}, function (err, result) {
          if (err) return cb(err);
          // send back the new item
          // the only array member
          cb(null, result[0]);
      });
    });
  };

  /****************************************
   @method: updateById(opts, callback)
     -- update existing document in collection
     -- PUT /:id
   @param: opts = {
            collection: where
            data: what
            id: which
          }
   @param: callback(err, code) [Function]
   @return: code = {success = true} || {success:false} [Object]
   @syntax:
     var opts = {
       collection: collectionName,
       id: @id,
       data: {}
     }
     wrap.updateById(opts, function(err, code){
       if(err) return cb(err);
       if(code.success===true) {...};
     });

  ***************************************/
  this.updateById = function(opts, cb) {
    var self = this;

    // better safe than sorry
    if(! opts.id) return cb(new Error('No id was provided, to updateById'));
    // no need to update _id itself
    if(opts.data._id) delete opts.data._id;

    self.connect(function (err, db) {
      if (err) return cb(err);
      db.collection(opts.collection)
        .update({_id: self.ObjectID(opts.id) },
        {'$set': opts.data}, {w: 1, safe: true, multi: false}, function (err, result) {
          if (err) return cb(err);

          var code = result === 1 ? {success: true} : {success: false};
          cb(null, code);
        });
    });
  };


  /****************************************
   @method: removeById(opts, callback)
   @param: opts = {
             collection: where
             id: which
           }
   @param: callback(err, code) [Function]
   @return: code = {success: true} || {success:false} [Object]
   @syntax:
     var opts = {
       id: @id
     }
     wrap.removeById(opts, function(err, code){
       if(err) return cb(err);
       if(code.success===true){...};
     });

  ***************************************/
  this.removeById = function(opts, cb) {
    var self = this;

    if(! opts.id) return cb(new Error('No id was provided, to removeById'));

    self.connect(function (err, db) {
      if (err) return cb(err);
      db.collection(opts.collection)
        .remove({_id: self.ObjectID(opts.id)}, {w:1}, function (err, result) {
          if (err) return cb(err);
          var code = result === 1 ? {success: true} : {success: false};
          cb(null, code);
        });
    });
  };
  /**** END Generic REST support Routines ****/

  /****************************************
   Extended Functionality
     @method: getDateTime()
     @method: show( object )
     @method: todayAsISODate()
     @method: dateAsISODate( date )

   ----------------------------------------------
   @method: show(object);
     -- display deep prettified console view of object
   @param: object to display

  ***************************************/
  this.show = function(data){
    console.log(util.inspect(data, true, 10, true));
  };
  this.todayAsISODate =  function () {
    return new Date().toISOString();
  };
  this.dateAsISODate =  function (date) {
    if(! date) return this.todayAsISODate();
    return new Date(date).toISOString();
  };
  this.insertAny = function (name, data, cb){
    this.db.collection(name)
      .insert(data, {safe: true}, function(err, result){
        if(err) cb(err);
        cb(null, result[0]);
      });
  };
  /****************************************/

  // END Interface Methods
  // private internal connection routine
  this._connect = function(cb){
    var self = this;
    var server = new Server(config.host, 27017, serverOptions );
    self.db = new MongoDB(config.database, server, {safe: false});
    self.db.open(function(err, db){
      if(err) cb(err);
      self.collection = self.db.collection;
      self.db.authenticate(config.username, config.password, function(err, result){
        isConnected = true;
        if(err) cb(err);
        // hand back the connected database
        process.nextTick(function() {
          cb(null, self.db);
        });
      });
    });
  };
}

function createWrapServer(config){ 'use strict';
  return new MongoWrap(config);
}
module.exports = exports = createWrapServer;

