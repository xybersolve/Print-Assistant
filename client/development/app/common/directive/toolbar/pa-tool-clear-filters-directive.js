(function (window, angular) {
  'use strict';

  angular
    .module('app')
    .directive('paCommonToolClearFilters', function() {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          onClear: '&'
        },
        controller: function($scope) {
          $scope.clearFilters = function() {
            $scope.onClear();
          };
        },
        template: '<button class="btn btn-default btn-sm" title="Clear all search filters" ng-click="clearFilters()"><i class="fa fa-refresh"></i></button>'
      };
    });

})(window, window.angular);
