(function (window, angular) {
  'use strict';

  angular
    .module('app')
    .directive('paNavbar', ['$location', function($location ) {
      return {
        restrict: 'E',
        templateUrl:'app/navbar/navbar.html',
        controller: function($scope) {
          $scope.isActive = function(locationDef) {
            return $location.path().indexOf(locationDef) === 0;
          };
        }
      };
    }]);

})(window, window.angular);


