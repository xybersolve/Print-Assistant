(function (window, angular) {
  'use strict';

  angular
    .module('xs.load.status.message', [])
    .config(function($httpProvider) {
        $httpProvider.interceptors.push('loadInterceptSvc');
    })

    // #TODO Needs to be built out
    .directive('xsLoadStatusMessage', function() {
      return {
        restrict: 'EA',
        link: function($scope, $element, attrs) {
          function show() {
            //console.log('Showing load status message');
            $element.css({display:'block'});
          }
          function hide(){
            //console.log('Hiding load status message');
            $element.css({display:'none'});
          }
          $scope.$on('xsStartedLoading', show);
          $scope.$on('xsFinishedLoading', hide);
          hide();
        }
      };
    })
    .factory('loadInterceptSvc', function($q, $rootScope) {
      var currentlyActive = 0;
      function start(){
        if(currentlyActive===0){
          $rootScope.$broadcast('xsStartedLoading');
        }
      }
      function finish(){
        currentlyActive--;
        if(currentlyActive===0){
          $rootScope.$broadcast('xsFinishedLoading');
        }
      }
      return {
        request: function(config) {
          start();
          return config || $q.when(config);
        },
        response: function(response) {
          finish();
          return response || $q.when(response);
        },
        responseError: function(rejection) {
          finish();
          return $q.reject(rejection);
        }
      };
    });

})(window, window.angular);
