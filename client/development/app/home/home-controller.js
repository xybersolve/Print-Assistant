(function (window, angular) {
  'use strict';

  angular
    .module('app.reports')
    .controller('HomeCtrl', ['$rootScope', '$location', 'reportSvc', HomeCtrl]);
  function      HomeCtrl(     $rootScope,   $location,   reportSvc ){
    var vm = this;
    reportSvc.getReport('simple', 'systemTotals').success(function(results) {
      angular.extend(vm, results);
    });
    vm.user = $rootScope.user;
  }

})(window, window.angular);

