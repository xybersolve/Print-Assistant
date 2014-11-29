(function (window, angular) {
  'use strict';

  angular
    .module('xs.debug', [])
    .directive('xsDebugShow', function() {
      return {
        restrict: 'EA',
        priority: 10000,
        scope: {
          target: '='
        },
        link: function($scope, $element, $attrs) {
          $scope.$watch('target', function(newValue, oldValue) {
            if(newValue){
              console.log('***** XS Debug Show ******');
              console.table(newValue);
              console.dir(newValue);
              console.log('**************************');
            }
          });
        }
      };
    });

})(window, window.angular);
