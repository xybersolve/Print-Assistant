(function (window, angular) {
  'use strict';

  angular

    // Module Definitions
    .module('xs.file.reader', [])
    // Component Definitions
    .factory('fileReaderSvc', ['$q', '$log', fileReaderSvc])
    .controller('FileUploadCtrl',['$scope', 'fileReaderSvc', FileUploadCtrl])
    .directive('xsFileInput', xsFileInput);

  // *****************************************************
  //
  // xsFileInput
  //
  function xsFileInput($parse, fileReaderSvc) {
    return {
      restrict: 'EA',
      //template: '<input type="file" />',
      templateUrl: 'app/template/xybersolve/xs-file-upload.html',
      replace: false,
      scope: {
        action: '@',
        onSend: '@',
        imageFile: '='
      },
      controller: function($scope) {
        $scope.readImageFile = function() {
          console.log('getFile');
          fileReaderSvc.readDataAsUrl($scope.imageFile, $scope).then(function(result) {
            $scope.imageSrc = result;
          });
        };
      },
      link: function(scope, element, attrs) {
        var browseRequest  = element.find('#browse-request');
        var hiddenUploader = element.find('#hidden-uploader');

        browseRequest.click(function (window, angular) {
          hiddenUploader.click();
        });
        var modelGet = $parse(attrs.xsFileInput);
        var modelSet = modelGet.assign;
        var onChange = $parse(attrs.onChange);
        scope.$on('endFileRead', function () {
          console.log('Got end file read');
        });

        function updateModel() {
          console.log('updateModel()');
          scope.$apply(function () {
            scope.imageFile = hiddenUploader[0].files[0];
            /*
            fileReaderSvc.readDataAsUrl(scope.imageFile, scope).then(function(result) {
              console.log('Got result');
              scope.imageSrc = result;
            });
            */
            //scope.readImageFile();
            //modelSet(scope, hiddenUploader.files[0]);
            //onChange(scope);
          });
        }
        hiddenUploader.bind('change', updateModel);
      }
    };
  }

  // *****************************************************
  //
  // FileUploadCtrl - example of usage
  //
  function FileUploadCtrl($scope, fileReaderSvc) {
    $scope.readingFile = false;
    $scope.fileIsReady = false;
    /*
    $scope.readImageFile = function () {
      $scope.progress = 0;
      fileReaderSvc.readDataAsUrl($scope.imageFile, $scope).then(function(result) {
        $scope.imageSrc = result;
      });
    };*/

    $scope.$on('fileReadProgress', function(event, progress) {
      $scope.progress = Math.round(progress.loaded / progress.total);
    });
    $scope.$on('startFileRead', function() {
      $scope.imageSrc = '';
      $scope.readingFile = true;
    });
    $scope.$on('endFileRead', function() {
      $scope.readingFile = false;
      $scope.fileIsReady = true;
    });

  }
  // *****************************************************
  //
  //  fileReaderSvc
  //
  function fileReaderSvc($q, $log){
    return {
      readDataAsUrl: readDataAsUrl // @param file, @param scope
    };
    function onLoad(reader, dfr, scope){
      return function(){
        scope.$broadcast('endFileRead');
        scope.$apply(function() {
          dfr.resolve(reader.result);
        });
      };
    }

    function onError(reader, dfr, scope) {
      return  function(){
        scope.$broadcast('endFileRead');
        scope.$apply(function() {
          dfr.reject(reader.result);
        });
      };
    }
    function onProgress(reader, scope) {
      return function(event) {
        scope.$broadcast('fileReadProgress',{
          total: event.total,
          loaded: event.loaded
        });
      };
    }

    function getReader(dfr, scope) {
      var reader = new FileReader();
      reader.onload = onLoad(reader, dfr, scope);
      reader.onerror = onError(reader, dfr, scope);
      reader.onprogress = onProgress(reader, scope);
      return reader;
    }

    function readDataAsUrl(file, scope) {
      scope.$broadcast('startFileRead');
      var dfr = $q.defer();
      var reader = getReader(dfr, scope);
      reader.readAsDataURL(file);
      return dfr.promise;
    }

  }


})(window, window.angular);
