  (function (window, angular) {
  'use strict';

  angular
    .module('app.image')
    .directive('paImageUpload', function() {
      return {
        restrict: 'EA',
        replace: false,
        templateUrl: 'app/template/image-file-upload.html',
        scope: {
          onReady: '&',
          onUpload: '&',
          image: '='
        },
        link: function($scope, $elem, attrs) {
          var $hiddenUploader = $elem.find('#hidden-uploader');
          var $browserRequest = $elem.find('#browse-request');
          $browserRequest.click(function() {
            $hiddenUploader.click();
          });
        },
        controller: ['$scope', '$filter', 'fileReaderSvc', function($scope, $filter, fileReaderSvc) {
          $scope.progress = 0;
          $scope.isReadyToUpload = false;
          $scope.imageSrc = '';
          $scope.isLoading = false;

          $scope.sendRequest = function(elem) {
            $scope.imageSrc = undefined;
            $scope.isLoading = true;
            var file = elem.files[0];
            $scope.fileName = $filter('xsEllipsis')(file.name, 30);
            $scope.imageName = $scope.fileName;
            $scope.fileSize = $filter('number')(file.size);
            $scope.image.fileData = {
              file: file,
              name: file.name,
              size: file.size
            };
            fileReaderSvc.readDataAsUrl(file, $scope).then(function(result) {
              $scope.isLoading = false;
              $scope.imageSrc = result;
            });
            $scope.isReadyToUpload = true;
            //$scope.onReady();
            $scope.$apply();
          };
          $scope.$on('endFileRead', function() {
            console.log('gotEndFileRead');
            $scope.isLoading = false;
            $scope.$apply();
          });
          $scope.uploadFile = function() {
            $scope.onUpload();
          };
          $scope.$on('fileReadProgress', function(event) {
            console.dir(event);
            $scope.total= event.total;
            $scope.loaded = event.loaded;
            $scope.$apply();
          });
        }]
      };

    });

})(window, window.angular);
