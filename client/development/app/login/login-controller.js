(function (window, angular) {
  'use strict';

  angular
    .module('app')
    .controller('LoginCtrl', ['$state', 'loginSvc', 'notifySvc', LoginCtrl]);
    function     LoginCtrl(    $state,   loginSvc,   notifySvc) {

      var vm = this;
      vm.loginUser = {};
      vm.login = function() {
        loginSvc.login(vm.loginUser)
          .then(function(user){
            if(!user){
              vm.failed();
            } else if(user && user.isLoggedIn) {
              notifySvc.success('You are now logged in.','Login');
              vm.closeLogin();
            }
          }).catch(function() {
            vm.failed();
          });
      };
      vm.failed = function() {
        notifySvc.error('Sorry, those credentials did not match any user!','Login Failed');
      };
      vm.closeMsg = function() {
        $('login-message').hide();
      };
      vm.logout = function(){
          loginSvc.logout();
      };
      vm.closeLogin =  function(){
        $state.go('home');
      };

      // pull user from local storage or model user
      loginSvc.getLocallySavedLoginUser(function(user) {
        // just in case
        if(user.password) delete user.password;
        vm.loginUser = user;
      });

    }

})(window, window.angular);


