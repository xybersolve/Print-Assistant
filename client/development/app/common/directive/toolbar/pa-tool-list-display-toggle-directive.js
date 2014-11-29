(function (window, angular) {
  'use strict';

  angular
    .module('app')
    .directive('paListDisplayToggle', function() {
      return {
        restrict: 'E',
        scope: {
          listTitle: '@',
          displayTitle: '@',
          listState: '@',
          displayState: '@'
        },
        templateUrl: 'app/template/common/list-display-toggle.html'
      };
    });

})(window, window.angular);
