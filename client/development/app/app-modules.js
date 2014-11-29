(function (window, angular) {
  'use strict';

  angular.module('app',
    // Core Modules
    ['ngRoute',
     'ui.router',
     'ui.select',
     'ui.mask',
     'ui.bootstrap.accordion',
     'ngAnimate',
     'angularFileUpload',
     // UI Component Modules
     'app.image',
     'app.print',
     'app.reconcile',
     'app.lead',
     'app.settings',
     'app.reports',

     // Shared Modules
     'app.services',
     'app.filters',

      // External Modules
     'xs.ui.components',
     'xs.action-buttons',
     'xs.cache',
     'xs.debug'
    ]);

  angular.module('app.services', ['ngResource']);
  angular.module('app.filters',  []);

  angular.module('app.reports',  ['app.services', 'angularCharts']);

})(window, window.angular);
