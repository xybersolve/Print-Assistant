(function (window, angular) {
  'use strict';

  angular
    .module('xs.filters')
    .filter('xsSelectedOrAll', function() {
      return function(item, flag) {
        if(flag === true){
          return (item.isSelected === true);
        } else {
          return true;
        }
      };
    });

})(window, window.angular);
