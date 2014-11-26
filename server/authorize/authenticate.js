/*
  Authentication
   authentication.js
   -- calls DB to check user credentials and get role
   -- adds new users to DB, encrypting passwords
 */
var bcrypt = require('bcrypt')
   ,SALT_WORK_FACTOR = 10
   ,users = require('./../config/users.js');

module.exports = function(dbWrap){
  "use strict";

  var wrap = dbWrap;
  var db = wrap.db;
  var userCache = {};
  /*
    Main authentication routine (Login)
     -- check email and password match
     -- return entire user doc
     -- used by /login
   */
  function checkUser(user, cb) {
    getUser(user, function(err, ourUser) {
      if(err) throw err;
      if(! ourUser) return cb(null, false);
      bcrypt.compare(user.password, ourUser.password, function(err, isMatch) {
        if(err) return cb(err);
        ourUser.isLoggedIn = isMatch;
        console.log('checkUser: user.isLoggedIn ' + ourUser.isLoggedIn );
        cb(null, ourUser, isMatch);
      });
    });
  }
  /*
    Find one user by "email"
   */
  function getUser(user, cb){
    wrap.connect(function(err, db) {
      if(err) throw err;
      db.collection('users')
        .findOne({email: user.email}, function(err, data) {
          if(err) return cb(err);
          cb(null, data);
        });
    });
  }
  function getUsersAsObject(cb){
    /*
     Build a object of users keyed by _id
     - for quick in memory lookup
     - for relatively small user base only
     */
    wrap.connect(function(err, db) {
      if(err) cb(err);
      process.nextTick(function() {
        db.collection('users')
          .find({})
          .toArray(function(err, users) {
            if(err) return cb(err);
            userCache = {};
            users.forEach(function(user) {
              userCache[user._id] = user;
            });
            cb(null, userCache);
          });
      });
    });
  }
  function addUser(name, email, password, role, cb) {
    /*
      addUser using for CLI consumption
     */
    var user = {
      username: name,
      email: email,
      password: password,
      role: role,
      isSuper: (role === 'super'),
      autoLogin: false // default to not remember
    };
    hashPassword(user, function(err, user){
      if(err) throw err;
      insertUser(user, function(err, tempUser) {
        if(err) throw err;
        // check if they are there
        getUser(user, function (err, newUser) {
          if(err) throw err;
          // return new user
          if(cb) cb(newUser);
        });
      });
    });
  }
  function initUsers(cb) {
    /*
      System initialization routine
      Adds all users defined in JSON list
        - users.js
        - ** WARNING: will reset user _id **
     */
    deleteUsers(function(){
      users.forEach(function(user, idx){
        user.isSuper = (user.role === 'super');
        user.autoLogin = false;
        hashPassword(user, function(err, user){
          insertUser(user, function(err, user) {
            wrap.show(user);
          });
        });
      });
    });
  }
  function checkForDupes(email, cb) {
    wrap.connect(function(err, db) {
      if(err) cb(err);
      db.collection('users')
        .find({email: email})
        .toArray(function(err, data) {
          if(err) cb(err);
          cb(null,  data && data.length > 0 );

          //authenticate.addUser(name, email, password, role);
        });
    });
  }
  function insertUser(user, cb) {
    wrap.connect(function(err, db) {
      db.collection('users')
        .insert(user, function(){
          if(cb) cb(null, user);
        });
    });
  }
  function updateUser(user, cb) {
   wrap.connect(function (err, db) {
      db.collection('users')
        .update({email: user.email},
        {'$set':{password:user.password,
           role: user.role}},
        true, false, // upsert, one only
        function(){
          if(cb) cb();
        }
      );
    });
  }
  /*
    Delete all current users
   */
  function deleteUsers(cb) {
    wrap.connect(function(err, db) {
      db.collection('users')
        .remove(function(){
          if(cb) cb();
        });
    });
  }
  function touchDB(cb){
    wrap.connect(function(err, db) {
      db.collection('users')
        .findOne(function(err, result) {
          if(err) cb(err);
          cb(result);
        });
    });
  }
  /*
    Internal encrypt and decrypt routines for password
   */
  function hashPassword(user, cb) {
    saltWord(user.password, function (err, hashed) {
      user.password = hashed;
      cb(null, user);
    });
  }
  function saltWord(word, cb){
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if(err) throw err;
      bcrypt.hash(word, salt, function(err, hash){
        if(err) throw err;
        word = hash;
        cb(null, hash);
      });
    });
  }
  return {
    addUser: addUser,
    initUsers: initUsers,
    checkUser: checkUser,
    checkForDupes: checkForDupes,
    getUsersAsObject: getUsersAsObject,
    touchDB: touchDB
  };
};
