(function (window, angular) {
  'use strict';

  angular
    .module('app')
    .directive('paPanel', function() {
      return {
        restrict: 'EA',
        templateUrl: 'app/template/common/panel.html',
        transclude: true,
        scope: {
          panelTitle: '@title'
        }
      };
    });

})(window, window.angular);
