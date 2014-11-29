(function (window, angular) {
  'use strict';

  angular
    .module('app.reports')
    .factory('reportSvc', ['$q', '$http', reportSvc]);
  function    reportSvc(    $q,   $http){
    var baseUrls = {
      simple: '/api/reports/simple/',
      totals: '/api/reports/totals/'
    };

    return {
      getReport: getReport,
      getBaseUrl: getBaseUrl,
      buildUrl: buildUrl,
      computePercentOfTotal: computePercentOfTotal
    };

    function getReport(){ /* @params: baseURLKey, report */
      // return $http promise (then, catch, finally, success, error)
      var args = arguments;
      var url = (args.length===1) ? args[0] : buildUrl(args[0], args[1]);
      console.log('reportSvc.getReport -> url: ' + url);
      return $http.get(url);
    }
    function buildUrl(type, report) {
      console.log('buildUrl: ' + type + ', ' + report);
      return baseUrls[type] + report;
    }
    function getBaseUrl(type) {
      return baseUrls[type];
    }
    function computePercentOfTotal(total, grandTotal){
      return  Math.round(( total/grandTotal) * 100 );
    }

  }

})(window, window.angular);
