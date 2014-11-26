(function (window, angular) {
  'use strict';

  angular
    .module('app.services')

    .config(function($httpProvider){
      $httpProvider.interceptors.push('authInterceptor');
    })

    .factory('authInterceptor', function($q, loginSvc){
      return {
        request: function(config) {
          loginSvc.getUserToken(function(token) {
            if (token) {
              console.log(token);
              config.headers = config.headers || {};
              config.headers.Authorization = 'Bearer ' + token;
            }
          });
          return config || $q.when(config);
        }
      };
    });

})(window, window.angular);
