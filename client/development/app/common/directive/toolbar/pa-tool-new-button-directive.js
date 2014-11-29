(function (window, angular) {
  'use strict';

  angular
    .module('app')
    .directive('paNewButton', function() {

      return {
        restrict: 'E',
        templateUrl: 'app/template/common/new-button.html',
        scope: {
          onStartNew: '&',
          titleText: '@',
          display: '@'
        },
        controller: function($scope) {
          $scope.startNew = function() {
            $scope.onStartNew();
          };
        }
      };
    });

})(window, window.angular);
