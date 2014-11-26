var express   = require('express')
  , router    = express.Router()
  , jwt       = require('jsonwebtoken')
  , auth      = null
  , jwtSecret = '';

module.exports = function(authenticate, secret) { 'use strict';
  auth = authenticate;
  jwtSecret = secret;

  router.post('/', function(req, res, next){
    var user = req.body;
    console.log('POST /login');
    console.dir(user);
    if( !user.email || !user.password ){
      console.log('!!user.email || !user.password');
      res.json({isLoggedIn: false, message: 'Must provide email and password to login'});
    } else {
      auth.checkUser(user, function(err, ourUser, isMatch) {
        if(ourUser && ourUser.isLoggedIn){
          // don't send password to client
          if (ourUser.password) delete ourUser.password;
          var token = jwt.sign(ourUser, jwtSecret);
          console.log('Tokenized header');
          console.dir(token);
          res.json({token: token, user:ourUser});

        } else {
          res.status(401).json({isLoggedIn:false});
        }
      });
    }
  });

  return router;
};
