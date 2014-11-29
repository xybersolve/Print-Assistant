(function (window, angular) {
  'use strict';

  angular
    .module('app')
    .directive('paNavbarLogin',['$location', 'loginSvc', function($location, loginSvc) {
      return {
        restrict: 'E',
        templateUrl: 'app/navbar/navbar-login.html',
        controller: function($scope) {
          $scope.logout = function() {
            loginSvc.logout();
            $location.path('/login');
          };
        }
      };
    }]);

})(window, window.angular);


