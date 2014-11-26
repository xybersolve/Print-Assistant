(function (window, angular, _ ) {
  'use strict';

  angular
    .module('app')

    .constant('BASE_URL', 'http://xybersolve.com:7777')

    .value( 'toastr', toastr )
    .value( '_', _ )

    .config(function(uiSelectConfig) {
      uiSelectConfig.theme = 'bootstrap';
    })

    .run(function($rootScope, $route, $location, $state, $stateParams, loginSvc) {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
      $rootScope.stateHistory = [];
      $rootScope.isLoggedIn = false;
      $rootScope.user = {
        isLoggedIn: false,
        name: '',
        email: ''
      };


      // delete and get fresh token from server
      loginSvc.removeUserToken();
      // try background login - using local credentials
      loginSvc.autoLogin().then(function(ourUser){
        if(ourUser === null || ourUser.isLoggedIn === false){
            $location.path('/login');
          } else if(ourUser && ourUser.isLoggedIn) {
            // User was logged in via auto-login
          $state.go('home');
          }
        }).catch(function() {
          $location.path('/login');
        });

      $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        $rootScope.stateHistory.push(toState.name);
      });
      $rootScope.goBack = function () {
        var prevState = $rootScope.stateHistory.length > 1 ? $rootScope.stateHistory.splice(-2)[0] : "/";
        $state.go(prevState);
      };
    });

})(window, window.angular, window._);

