(function (window, angular) {
  'use strict';

  angular
    .module('xs.filters', [])
    .filter('xsCamel2Snake', function(item) {
      console.log('xsCamel2Snake');
      return function(item) {
        console.log('item: ' + item);
        item = item.replace(/\W+/g, '-').replace(/([a-z\d])([A-Z])/g, '$1-$2');
        console.log('filtered: ' + item);
        return item;
      };
    })
    .filter('xsCamel2Human', function(item) {
      return function(item) {
        return item.charAt(0).toUpperCase() + item.substr(1).replace(/[A-Z]/g, ' $&');
      };
    })
    .filter('xsSnake2Camel', function() {
      return function(item) {
        return  item.replace(/\W+(.)/g, function (x, chr) {return chr.toUpperCase();});
      };
    });

})(window, window.angular);
