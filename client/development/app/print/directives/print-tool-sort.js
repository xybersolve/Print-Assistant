(function (window, angular) {
  'use strict';

  angular
  .module('app.print')

  .directive('paPrintToolSort', function() {
    return {
      restrict: 'E',
      templateUrl: 'app/template/print-tool-sort.html',
      scope : {
        sortOrder: '='
      },
      controller: function($scope) {
        $scope.setSortOrder = function(name) {
          $scope.sortOrder = name;
        };
      }
    };
  });

})(window, window.angular);