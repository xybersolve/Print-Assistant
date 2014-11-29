(function (window, angular) {
  'use strict';

  angular
    .module('app')
    .config(['$httpProvider', function($httpProvider) {
      if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
      }
      // force refresh for development
      $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
    }])

    .config(['$stateProvider', '$urlRouterProvider', appRoutes]);

  function appRoutes ($stateProvider, $urlRouterProvider) {

    //$urlRouterProvider.otherwise('/home');

    $stateProvider

      .state('login', {
        url: '/login',
        templateUrl: 'app/login/login.html',
        controller: 'LoginCtrl as login'
      })
      .state('home', {
        url: '/home',
        templateUrl: 'app/home/home.html'
      });

    }

})(window, window.angular);

