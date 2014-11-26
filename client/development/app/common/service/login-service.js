(function (window, angular) {
  'use strict';

  angular
    .module('app.services')
    .factory('loginSvc', ['$http', '$rootScope', '$q', 'userCacheSvc', loginSvc]);
  function    loginSvc (   $http,   $rootScope,   $q,   userCacheSvc){

    var INFO_KEY = 'info';
    var LOGIN_EMAIL_KEY = 'login.email';
    var LOGIN_PASSWORD_KEY = 'login.password';
    var LOGIN_AUTO_KEY = 'login.auto';
    var USER_TOKEN_KEY = 'login.token';
    /*
      @class loginSvc (handles login and persistence)

      login(): loginUser -> _LOGIN_ -> user
      autoLogin(): loginUser -> _LOGIN_ -> user
      -- loginUser: locally saved login info
      -- user: authenticated user from backend DB
     */
    function login(loginUser) {
      // login entry for all client processes
      var dfd = $q.defer();
      $http.post('/api/login', loginUser)
        .success(function (result) {
          console.log('loginSvc.login->result');
          console.dir(result);
          var token = result.token;
          validateUser(result.user, function(valid, user) {
            if(user && valid === true){
              saveUserToken(token);      // save the token locally
              saveLoginUser(loginUser);  // save login user locally
              saveUserInfo(user);        // save user information locally
              //setUserHeaders(ourUser); // set user headers
              setAuthHeader(token);      // set HTTP token header
              dfd.resolve(user);
            } else {
              dfd.reject(null);
            }
          });
        })
        .error(function() {
          dfd.reject(null);
      });
      return dfd.promise;
    }
    // all entries call on validate
    // used to keep user logged in state
    function validateUser(user, cb) {
      if(user && user.isLoggedIn) {
        angular.extend($rootScope.user, user);
        cb(true, user);
      } else {
        $rootScope.user = $rootScope.user || {};
        $rootScope.user.isLoggedIn = false;
        cb(false, null);
      }
    }
    // Auto Login from "Remember Me"
    function autoLogin() {
      // "remember me" - automatic login
      var dfd = $q.defer();
      getLoginUser(function (loginUser) {
        console.log('autoLogin-> getLoginUser-> loginUser');
        console.dir(loginUser);
        if(loginUser && loginUser.autoLogin === true){
          login(loginUser).then(function(ourUser) {
            dfd.resolve(ourUser);
          }).catch(function() {
            dfd.reject(null);
          });
        } else {
          dfd.reject(null);
        }
      });
      return dfd.promise;
    }
    function logout() {
      removeLoginUser();
      saveUserToken();
      setAuthHeader();
      $rootScope.user.isLoggedIn = false;
    }
    function isLoggedIn(){
      return $rootScope.user.isLoggedIn;
    }
    // -----------------------------------------
    // READ & SAVE Routines
    // -------------------------------
    // Read & Save User Token
    function saveLoginUser(loginUser){
      if(loginUser){
        userCacheSvc.set(LOGIN_EMAIL_KEY, loginUser.email);
        userCacheSvc.set(LOGIN_PASSWORD_KEY, loginUser.password);
        userCacheSvc.set(LOGIN_AUTO_KEY, loginUser.autoLogin);
      }
    }
    function getLoginUser(cb){
      cb({
        email: userCacheSvc.get(LOGIN_EMAIL_KEY),
        password: userCacheSvc.get(LOGIN_PASSWORD_KEY),
        autoLogin: userCacheSvc.get(LOGIN_AUTO_KEY)
      });
    }
    function removeLoginUser(){
      // elect to retain "email" for next login attempt
      //userCacheSvc.remove(LOGIN_EMAIL_KEY);
      userCacheSvc.remove(LOGIN_PASSWORD_KEY);
      userCacheSvc.remove(LOGIN_AUTO_KEY);
      // delete token for this session
      removeUserToken();
    }
    function saveUserInfo(user) {
      userCacheSvc.set(INFO_KEY, user);
    }
    // -------------------------------------
    // User Token Get Set Routines
    function saveUserToken(token){
      userCacheSvc.set(USER_TOKEN_KEY, token);
    }
    function getUserToken(cb){
      // public method uses promise or callback
      var dfd = $q.defer();
      userCacheSvc.get(USER_TOKEN_KEY)
        .then(function(token) {
          dfd.resolve(token);
          if(cb) cb(token);
        })
        .catch(function() {
          dfd.reject(null);
          if(cb) cb(null);
        });
      return dfd.promise;
    }
    function removeUserToken(){
      userCacheSvc.remove(USER_TOKEN_KEY);
    }
    // -----------------------------------
    // Set HTTP Headers - User Auth & Info
    function setUserHeaders(user, token){
      // header info for all subsequent api REST Calls
      $http.defaults.headers.common['user-id'] = user._id;
      $http.defaults.headers.common['user-name'] = user.username;
    }
    function setAuthHeader(token){
      var authToken = token ? 'Bearer ' + token : '';
      $http.defaults.headers.common['Authorization'] = authToken;
    }

    function getGlobalUser() {
      return $rootScope.user;
    }

    return {
      user: getGlobalUser,
      getLocallySavedLoginUser: getLoginUser,
      autoLogin: autoLogin,
      isLoggedIn: isLoggedIn,
      login: login,
      logout: logout,
      getLocalUser: getLoginUser,
      getLoginUser: getLoginUser,
      getUserToken: getUserToken,
      setAuthHeader: setAuthHeader,
      removeUserToken: removeUserToken,
      removeLoginUser: removeLoginUser
    };
  }

})(window, window.angular);

