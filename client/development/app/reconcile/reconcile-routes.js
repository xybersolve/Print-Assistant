(function (window, angular) {
  'use strict';

  angular
    .module('app.reconcile')
    .config(['$stateProvider', reconcileRoutes]);

  function reconcileRoutes($stateProvider) {

    $stateProvider
      .state('reconcile', {
        url: '/reconcile',
        templateUrl: 'app/reconcile/main/reconcile.html',
        controller: 'ReconcileCtrl as recMain'
      })
    }

})(window, window.angular);
