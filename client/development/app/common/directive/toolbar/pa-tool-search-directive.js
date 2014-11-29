(function (window, angular) {
  'use strict';

  angular
    .module('app')
    .directive('paCommonToolSearch', function() {
      return {
        restrict: 'E',
        replace: true,
        scope : {
          searchModel: '=',
          paPlaceholder: '@',
          onChange: '&'
        },
        template:'<div class="input-group"><input type="text" ng-change="onChange()" class="form-control input-sm" placeholder={{paPlaceholder}} ng-model="searchModel"></div>'
      };
    });

})(window, window.angular);
