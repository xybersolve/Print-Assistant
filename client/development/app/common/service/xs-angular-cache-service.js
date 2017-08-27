(function (window, angular) {
  'use strict';

  angular
    .module('xs.cache', [])
    .factory('xsStorageFactory', function() {

      return function (storageKey) {
        return {
          set: function ( itemKey, value ) {
            var compositeKey = storageKey + '.' + itemKey;
            return localStorage.setItem(compositeKey, angular.toJson(value));
          },
          get: function ( itemKey ) {
            var compositeKey = storageKey + '.' + itemKey;
            var value = localStorage.getItem(compositeKey);
            return angular.fromJson(value);
          },
          remove: function ( itemKey ) {
            var compositeKey = storageKey + '.' + itemKey;
            return localStorage.removeItem(compositeKey);
          }
        };
      };
    })

  .factory('xsCacheFactory', function ($cacheFactory, xsStorageFactory) {

    return function (storageKey, capacity) {
      var cache = $cacheFactory(storageKey, {
        capacity: capacity
      });
      var storage = xsStorageFactory(storageKey);

      return {
        set: function ( itemKey, value ) {
          cache.put(itemKey, value);
          storage.set(itemKey, value);
        },
        get: function ( itemKey ) {
          var value = null;
          if (cache.get(itemKey)) {
            // found in ngCacheFactory
            value = cache.get(itemKey);
          } else {
            // not in cache
            if (storage.get(itemKey)) {
              // but found in local storage
              // get from storage - put in ngCacheFactory
              cache.put(itemKey, storage.get(itemKey));
              // and re-get from ngCacheFactory
              value = cache.get(itemKey);
            }
          }
          return value ? value : null;
        },
        remove: function ( itemKey ) {
          cache.remove(itemKey);
          storage.remove(itemKey);
        }
      };
    };
  })
  .provider('xsCacheBuilder', function() {

    this.$get = function(xsCacheFactory) {

    };
    this.buildClient = function(client) {
      cd('client')
    }
  });

})(window, window.angular);


