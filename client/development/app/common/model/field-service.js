(function (window, angular) {
  'use strict';

  angular
    .module('app.services')
    .factory('fieldSvc', ['$http','$q', fieldSvc]);

    function fieldSvc($http, $q){

      return {
        /*
         Loads field values into provided model node
         -- node: node to extend with field
         -- cb: callback is optional
         */
        loadFields: function (node, cb) {
          var fieldLookup = [
            'locations',
            'status',
            'materials',
            'sizes',
            'lines'
          ];
          $q.all([
            $http.get('/api/locations'),
            $http.get('/api/status'),
            $http.get('/api/materials'),
            $http.get('/api/sizes'),
            $http.get('/api/lines'),
          ])
            .then(function (results) {
              angular.forEach(results, function (result) {
                var field = fieldLookup.shift();
                node[field] = result.data.sort();
              });
            })
            .then(function (window, angular) {
              if (cb) cb(node);
            });
        },
        getLocations: function(cb) {
          // just a read to warm up the database (auth)
          $http.get('/api/locations').success(function(data) {
            if(cb) cb(data);
          });
        }

      };
    }

})(window, window.angular);


