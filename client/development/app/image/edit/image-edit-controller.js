(function (window, angular) {
  'use strict';

  angular
    .module('app.image')
    .controller('ImageEditCtrl', ['$rootScope', '$state', '_', '$upload', 'notifySvc', 'lineSvc', 'image', 'lines', ImageEditCtrl]);
    function     ImageEditCtrl (   $rootScope,   $state,   _ ,  $upload,   notifySvc,   lineSvc,   image,   lines  ) {

      //#TODO: image file upload and split (thumbnail, med, large) on server

      var modes = {
        edit:  'Edit Image',
        new:   'Create New Image',
        clone: 'Clone Existing Image'
      };
      var mode = $state.current.data.mode;

      var imageModel = {
        name: '',
        fileStub: '',
        lines:[],
        owner: $rootScope.user.username
      };

      var vm = this;
      vm.title = modes[mode];
      vm.mode = mode;
      vm.lines = lines;

      // ****************************************
      // Image Routines
      if(mode==='new'){
        // extend newed image service with enhanced model
        vm.image = angular.extend(image, imageModel);
      } else {
        // use image from service
        vm.image = image;
        // select lines image is associated with
        if(vm.image.lines){
          if(angular.isArray(vm.image.lines)){
            angular.forEach(vm.image.lines, function(line) {
              var found = _.findWhere(vm.lines, {name: line.name});
              if(found){
                found.isSelected = true;
              }
            });
          }
        }
      }
      vm.save = function() {
        console.log('Updating Image');
        console.dir(vm.image);
        vm.image.update().then(function(result) {
          if(result.success===true){
            notifySvc.success('Successfully saved Image.');
            vm.goBack();
          } else {
            notifySvc.error('Unable to save Image!');
          }
        });

      };
      // ******************************************
      // Line Routines
      function initializeNewLine () {
       vm.newLine = new lineSvc();
       vm.newLine.name = '';
       vm.newLine.description = '';
      }
      // initialize for first add functionality
      initializeNewLine();

      vm.addLine = function() {
        angular.extend(vm.newLine, {isSelected: true});
        vm.newLine.$save().then(function(result) {
          if(result){
            notifySvc.success('Successfully added a new Image Line.');
            vm.lines.push(result);
            initializeNewLine();
          } else {
            notifySvc.error('Oops! Failed to add new Image Line!');
          }
        });
      };
      vm.gotLineChange = function() {
        vm.image.lines = [];
        angular.forEach(vm.lines, function (line) {
          if(line.isSelected){
            vm.image.lines.push({name: line.name});
          }
        });
      };
      // ******************************************
      // Interface Routines
      vm.cancel = function() {
        vm.goBack();
      };
      vm.goBack = function(){
        $rootScope.goBack();
      };
      vm.upload = function(data) {
        console.log('imageEdit.upload()');
        console.dir(data);
      };
    }

})(window, window.angular);


