#MongoWrap
Wraps native node mongoDB driver, to provide persistent authenticated connection and routines useful to the construction of RESTful interfaces. 
MongoWrap's primary goal is to provide a wrapper for the more generic calls & persisted connection, but not to block native "db" calls (i.e., best of both worlds).      

###MongoWrap API 
######Basics
* [Basic Usage](#usage)
* [Configuration](#configure)
* [connect()](#connect)

######Generic Methods:
* [findAll()](#find-all)
* [findById()](#find-by-id)
* [insert()](#insert)
* [updateById()](#update-by-id)
* [removeById()](#remove-by-id)

######Utility Methods:
* [show()](#show)
* [todayAsISODate()](#today-as-iso-date)
* [dateAsISODate(date)](#date-as-iso-date)

----
<a name="usage"></a>
###Basic Usage
#####Use mongoDb "db" directly (passed in from "connect" method)
```js
  // for calls requiring additional functionality 
  // than generic wrapper interface provides
  dbWrap.connect(function(err, db){
    db.collection('name')
      .find({},{},{})
      .toArray(...
  });
  
  // run an "aggregate" off "db" collection  

  dbWrap.connect(function(err, db){
    if(err) return cb(err);
    db.collection('name')
      .aggregate({$group: {_id: '$field'}}, 
      function(err, results){
      if(err) return cb(err);
      cb(null, results);
    });
  });
```  
#####or, use MongoWrap's convenience methods for generic REST type calls
  
```js
  var opts = {
    collection: @collection,
    id: @id
  }
  dbWrap.findById(opts, function(err, result){
    if(err) return cb(err);
    if(result) cb(null, result);
  });
    
```
----
<a name="configure"></a>
###Instantiate & Configure MongoWrap 

```js
// create wrapper by passing in connect configuration
// this is likely stored in a json file or environment variables  

var config = {  
  "username": "username",  
  "password": "password",  
  "database": "database",  
  "host"    : "localhost", 
  "port"    : "27017",     
}
var dbWrap = new MongoWrap(config)

// - or inline - 
 
var dbWrap = new MongoWrap({
    username: "username",  
    password: "password",  
    database: "database",  
    host    : "localhost", 
    port    : "27017",     
});

```
----
<a name="connect"></a>
###Create Connection (Express example)

```js
// instantiate MongoWrap
var dbWrap = require('./server/tools/mongowrap/mongo-wrap')(cfg.mongo)

// share instance of MongoWrap to modules requiring db interaction
reportProvider = require('./server/data-providers/report-provider')(dbWrap) 

// start server after db is connected
dbWrap.connect(function(err, db) {
  if(err) throw err;

  app.listen(cfg.express.port);
  console.log('Started Local Server, Port:' + cfg.express.port);
});

```
----
###Generic Query & Manipulation Methods 
<a name="find-all"></a>
######findAll()
Returns array of documents, using user defined "query" & "sort" 

Syntax:
```js
    var query = {
      collection: @collection,
      where: {},
      sort: {}
    }
    dbWrap.findAll(query, function(err, results){
      if(err) return cb(err);
      if(results){...}
    });

```
==== 
<a name="find-by-id"></a>
######findById()
Returns a single document, located using item "id"  

Syntax:
```js
    var opts = {
      collection: @collection,
      id: @id
    }
    dbWrap.findById(opts, function(err, result){
      if(err) return cb(err);
      if(result) cb(null, result);
    });
``` 
====
<a name="insert"></a>
######insert()
Insert a new document  

Syntax:
```js
    var opts = {
      collection: collectionName,
      data: {}
    }
    dbWrap.insert(opts, function(err, result){
      if(err) return cb(err);
      if(result} cb(null, result);
    })
```
====
<a name="update-by-id"></a>
######updateById()
Update existing document, using item "id"   

Syntax:
```js
   var opts = {
     collection: collectionName,
     id: @id,
     data: {}
   }
   dbWrap.updateById(opts, function(err, code){
     if(err) return cb(err);
     if(code.success===true) {...};
   });
```
====
<a name="remove-by-id"></a>
######removeById()
Delete existing document, using item "id"   

Syntax:
```js
    var opts = {
      collection: @collection,
      id: @id
    }
    dbWrap.removeById(opts, function(err, code){
      if(err) return cb(err);
      if(code.success===true){...};
    });
```
----

###Utility Methods    
<a name="show"></a>
######show()
Log out a colored tree view of any JavaScript object. Handy to check results. Basically logs a util.inspect(data, true, 10, true) on the object. It is handy.

Syntax:
```js
   dbWrap.show(doc);
```
<a name="today-as-iso-date"></a>
######todayAsISODate()
Return today's date as in ISO format 

Syntax:
```js
   var ISODate = dbWrap.todayAsISODate();
   
```
<a name="date-as-iso-date"></a>
######dateAsISODate()
Return a date in ISO format, if no date is passed in, it return today's date in ISO format. 

Syntax:
```js
   var ISODate = dbWrap.todayAsISODate(data);
   
```
----
#####Thoughts:
* As every db call requires a collection name in the options parameter, it seems more intuitive to pass the collection name as a first parameter, or at least allow this as an option.
* As I have decided to share this library, I think may be time to move to a revealing module pattern and hide the internal _connect method. 
  
