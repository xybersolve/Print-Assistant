(function (window, angular, _ ) {
  'use strict';

  angular
    .module('app')

    .filter('xsStripSpace', function () {
      return function (item) {
        function stripSpace(item) {
          return item.replace(/\s+/g, '');
        }
        return stripSpace(item);
      };
    })
    .filter('xsFirstword', function () {
      return function (item) {
        function firstWord(item) {
          var work = item.split(' ');
          if(work && work.length > 0){
            return work[0];
          } else {
            return item;
          }
        }
        return firstWord(item);
      };
    })

    .filter('unique', function() {
      return function (arr, field) {
        return _.uniq(arr, function (a) {
          return a[field];
        });
      };
    })
    .filter('xsAcronym', function(){
      return function(item){
        //var ptn = /\b(\w)\w+\s+\b(\w)\w+\s+\b(\w)\w+\s+\b(\w)\w+\s+\/
        var result = item;
        var pattern = /\b([A-Za-z]{1})/g;

        if(angular.isString){
          var matches = item.match(pattern);
          if(angular.isArray(matches)){
            result = matches.join('');
          }
        }
        return result;
      };
    })
    .filter('xs2Dash',function () {
      return function(item) {
        return item.replace(/[-_\s]+(.)?/g, function(match, c){ return c ? c.toUpperCase() : ""; });
      };
    })

    .filter('xs2Camel',function () {
      return function(item) {
        return item.replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase();
      };
    })

    .filter('xsEllipsis', function () {
      return function (input, chars, breakOnWord) {
        if (isNaN(chars)) return input;
        if (chars <= 0) return '';
        if (input && input.length > chars) {
          input = input.substring(0, chars);

          if (!breakOnWord) {
            var lastspace = input.lastIndexOf(' ');
            //get last space
            if (lastspace !== -1) {
              input = input.substr(0, lastspace);
            }
          }else{
            while(input.charAt(input.length-1) === ' '){
              input = input.substr(0, input.length -1);
            }
          }
          return input + '...';
        }
        return input;
      };
    });

})(window, window.angular, window._ );