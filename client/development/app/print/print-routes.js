(function (window, angular) {
  'use strict';

  angular
    .module('app.print')
    .config(['$stateProvider', printRoutes ]);

  function printRoutes($stateProvider) {

    $stateProvider
      .state('prints', {
        url: '/prints',
        abstract: true,
        templateUrl: 'app/print/main/print-main.html',
        controller: 'PrintCtrl as printMain',
        resolve: {
          prints: function (printSvc) {
            return printSvc.query();
          }
        }
      })
      .state('prints.display', {
        url: '/display',
        templateUrl: 'app/print/list/print-display.html'
      })
      .state('prints.list', {
        url: '/list',
        templateUrl: 'app/print/list/print-list.html'
      })
      .state('prints.edit', {
        url: '/edit/:mode',
        templateUrl: 'app/print/edit/print-edit.html',
        controller: 'PrintEditCtrl as printEdit',
        resolve: {
          images: function (imageSvc, $q) {
            return $q.when(imageSvc.query());
          }
        }
      });
  }

})(window, window.angular);
