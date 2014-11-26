(function (window, angular) {
  'use strict';

  var widgetDirectory = xybo.getScriptDirectory();

  angular
    .module('app')
    .directive('paCommonToolLine', function () {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: widgetDirectory + 'tool-line-template.html',
        scope: {
          lines: '=',
          filterModel: '='
        }
      };
    });

})(window, window.angular);