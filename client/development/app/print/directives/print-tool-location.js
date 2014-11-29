(function (window, angular) {
  'use strict';

  angular
    .module('app.print')
    .directive('paPrintToolLocation', function () {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'app/template/print-tool-location.html',
        scope: {
          locations: '=',
          filterModel: '=',
          onChange: '&'
        }
      };
    });

})(window, window.angular);