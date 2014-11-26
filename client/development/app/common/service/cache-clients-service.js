(function (window, angular) {

  'use strict';
  angular
    .module('app.services')
    // cache factories for specific components
    .factory('imageCacheSvc', function(xsCacheFactory) {
      return xsCacheFactory('image', 500);
    })
    .factory('printCacheSvc', function(xsCacheFactory) {
      return xsCacheFactory('print', 500);
    })
    .factory('reconcileCacheSvc', function(xsCacheFactory) {
      return xsCacheFactory('reconcile', 500);
    })
    .factory('userCacheSvc', function(xsCacheFactory) {
      return xsCacheFactory('user', 500);
    })
    .factory('reportCacheSvc', function(xsCacheFactory) {
      return xsCacheFactory('report', 500);
    })
    .factory('leadCacheSvc', function(xsCacheFactory) {
      return xsCacheFactory('lead', 500);
    });

})(window, window.angular);
