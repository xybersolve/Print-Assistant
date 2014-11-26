(function (window, angular) {
  'use strict';

  angular
    .module('app')

    .filter('paStatusFilter', function(){
      return function(items, selected){
        var out = [];
        if(angular.isArray(items) && angular.isArray(selected)){
          for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if(selected.indexOf(item.status) !== -1 ){
              out.push(item);
            }
          }
        } else {
          out = items;
        }
        return out;
      };
    })

    .filter('paPropsFilter', function() {
      return function(items, props) {
        var out = [];

        if (angular.isArray(items)) {
          items.forEach(function(item) {
            var itemMatches = false;

            var keys = Object.keys(props);
            for (var i = 0; i < keys.length; i++) {
              var prop = keys[i];
              var text = props[prop].toLowerCase();
              if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                itemMatches = true;
                break;
              }
            }

            if (itemMatches) {
              out.push(item);
            }
          });
        } else {
          // Let the output be the input untouched
          out = items;
        }

        return out;
      };
    });

})(window, window.angular);

