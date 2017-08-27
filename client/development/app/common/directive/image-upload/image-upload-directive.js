// jshint ignore: start
(function (window, angular, undefined) {  'use strict';

  angular
    .module('app')
    .directive('imageUpload', ['$rootScope', '$timeout', '$upload', 'userSvc',
      function(                 $rootScope,   $timeout,   $upload ,  userSvc){
        return {
          restrict: 'EA',
          templateUrl: 'app/common/directive/image-upload/image-upload-template.html',
          scope: {
            uploadUrl: '@',
            fields: '=',
            imageUrl: '=',
            onImage: '&',
            placeHolder: '@',
            support: '@'
          },
          link: function () {

          },
          controller: function ($scope) {
            $scope.files = undefined;
            $scope.upload = function (files) {
              /*
               var params = {
               url: $scope.uploadUrl,
               fields: $scope.fields,
               file: file
               };
               // late binding for user
               params.fields.broadcasterId = userSvc.user._id;
               */
              //console.log('imageUpload, fields.broadcasterId userSvc.user._id: ', userSvc.user._id);
              $scope.fields.userId = $rootScope.user._id;

              if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                  var file = files[i];
                  $upload.upload({
                    url: $scope.uploadUrl,
                    fields: $scope.fields,
                    file: file
                  }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    $scope.progress = progressPercentage;
                    //console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                  }).success(function (data, status, headers, config) {
                    if(data.success === true){
                      $scope.imageUrl = data.url;
                      $timeout(function () {
                        $scope.onImage();
                      });
                    } else {
                      console.log('ERROR in imageUploadDirective:', data);
                    }
                  });
                }
              }
            };
          }
        };

      }]);



})(window, window.angular);
