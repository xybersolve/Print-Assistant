/*
  Authorize
    authorize.js
    - middleware for Express Routes - uses session
    -- provides express interface to authenticate
 */
module.exports = function(authenticate){
  'use strict';
  // fast in route check for session and user
  function verifyUser(req, res, next){
    // check for session and login state
    if (! req.user){
      forceLogin(res);
    } else if (! req.user.isLoggedIn ){
      forceLogin(res);
    } else if ( req.user.isLoggedIn !== true ){
      forceLogin(res);
    } else {
      next();
    }
  }
  function forceLogin(res){
    // put them on the login page
    res.status(500).send('Insufficient access!');
  }
  function informDenied(res){
    res.headers['block-code'] = 1;
    res.status(500).send('Insufficient access!');
  }
  function checkUserLogin(){
    // pass on to authenticate
  }
  function getUserInfo(req, res, next){
    // pull from headers to request object
    var user = {
      id: null,
      name: null
    };
    req.user = user;
    if(! req.headers['user_id']){
      user = {};
      user.id = req.headers['user_id'];
    }
    if(! req.headers['user_name']){
      user.name = req.headers['user_name'];
    }
    return next();
  }


  // reveal public function
  return {
    verifyUser     :  verifyUser,
    checkUserLogin : checkUserLogin,
    getUserInfo    : getUserInfo
  };

};