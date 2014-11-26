(function (window, angular) {
  'use strict';

  angular
    .module('app.image')
    .config(['$stateProvider', imageRoutes ]);

  function imageRoutes($stateProvider) {

    $stateProvider
      .state('images', {
        url: '/images',
        template: '<div ui-view><div class="text-center" style="font-size:50px;margin-top:50%;color:#dddddd;">Loading..</div></div>'
        //templateUrl: 'app/image/image-main.html',
        //controller: 'ImageCtrl as imageMain'
      })
      .state('images.list', {
        url: '/list',
        templateUrl: 'app/image/list/image-list.html',
        controller: 'ImageListCtrl as imageList',
        resolve: {
          images: function (imageSvc) {
            return imageSvc.query();
          }
        }
      })
      .state('images.display', {
        url: '/display',
        templateUrl: 'app/image/list/image-display.html',
        controller: 'ImageListCtrl as imageList',
        resolve: {
          images: function (imageSvc) {
            return imageSvc.query();
          }
        }
      })
      .state('images.edit', {
        url: '/edit/:id',
        templateUrl: 'app/image/edit/image-edit-wizard.html',
        controller: 'ImageEditCtrl as imageEdit',
        data: {
          mode: 'edit'
        },
        resolve: {
          image: function(imageSvc, $stateParams, $q) {
            var id = $stateParams.id;
            return imageSvc.get({id: id}).$promise;
          },
          lines: function (lineSvc) {
            return lineSvc.query().$promise;
          }
        }
      })
      .state('images.new', {
        url: '/new',
        templateUrl: 'app/image/edit/image-edit-wizard.html',
        controller: 'ImageEditCtrl as imageEdit',
        data: {
          mode: 'new'
        },
        resolve: {
          image: function (imageSvc, $q) {
            return $q.when(new imageSvc());
          },
          lines: function(lineSvc) {
            return lineSvc.query().$promise;
          }
        }
      });
  }

})(window, window.angular);
