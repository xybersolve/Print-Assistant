(function (window, angular) {
  'use strict';

  angular
    .module('app.print')

    .directive('paPrintToolStatus', function() {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'app/template/print-tool-status.html',
        scope: {
          status: '=',
          filterModel: '='
        }
      };
    });

})(window, window.angular);