(function (window, angular) {
  'use strict';

  angular
    .module('app.settings')
    .config(['$stateProvider', settingsRoutes ]);

  function settingsRoutes($stateProvider) {

    $stateProvider
      .state('settings', {
        url: '/settings',
        abstract: true,
        templateUrl: 'app/settings/main/settings-main.html',
        controller: 'SettingsMainCtrl as settingsMain'
      })

      .state('settings.locations', {
        url: '/locations',
        views: {
          'display': {
            templateUrl: 'app/settings/locations/location-list.html',
            controller: 'LocationMainCtrl as locationMain'
          }
        },
        resolve: {
          locations: function(locationSvc) {
            return locationSvc.query();
          }
        }
      })
      .state('settings.lines', {
        url: '/lines',
        views: {
          'display' : {
            templateUrl: 'app/settings/lines/lines-list.html'
            //controller: 'LinesMainCtrl as linessMain'
          }
        }
      })
      .state('settings.status', {
        url: '/status',
        views: {
          'display' : {
            templateUrl: 'app/settings/status/status-list.html',
            controller: 'StatusMainCtrl as statusMain'
          }
        }
      })
      .state('settings.sizes', {
        url: '/sizes',
        views: {
          'display' : {
            templateUrl: 'app/settings/sizes/sizes-list.html',
            controller: 'SizeMainCtrl as sizeMain'
          }
        }
      })
      .state('settings.user', {
        url: '/user',
        views: {
          'display' : {
            templateUrl: 'app/settings/user/user-edit.html',
            controller: 'UserEditCtrl as userEdit'
          }
        }
      })

      .state('location', {
        url: '/location',
        abstract: true,
        template: '<div ui-view></div>'
      })
      .state('location.edit', {
        url: '/edit/:id',
        templateUrl: 'app/settings/locations/location-edit.html',
        controller: 'LocationEditCtrl as locationEdit',
        resolve: {
          location: function(locationSvc, $stateParams, $q) {
            var id = $stateParams.id;
            return locationSvc.get({id: id}).$promise;
          }
        }
      })
      .state('location.new', {
        url: '/new',
        templateUrl: 'app/settings/locations/location-edit.html',
        controller: 'LocationNewCtrl as locationEdit'
      })

      .state('status', {
        url: '/status',
        abstract: true,
        template: '<div ui-view></div>'
      })
      .state('status.new', {
        url: '/new',
        templateUrl: 'app/settings/status/status-edit.html',
        controller: 'StatusNewCtrl as statusEdit'
      })
      .state('status.edit', {
        url: '/new',
        templateUrl: 'app/settings/status/status-edit.html',
        controller: 'StatusEditCtrl as statusEdit',
        resolve: {
          status : function(statusSvc, $stateParams) {
            var id = $stateParams.id;
            return statusSvc.get({id:id}).$promise;
          }
        }
      });
  }

})(window, window.angular);
