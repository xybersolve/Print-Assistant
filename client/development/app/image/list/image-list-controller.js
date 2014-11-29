(function (window, angular) {
  'use strict';

  angular
    .module('app.image')
    .controller('ImageListCtrl', ['$state', '$upload', 'imageSvc', 'images', ImageListCtrl]);
    function     ImageListCtrl (   $state,   $upload,   imageSvc ,  images ){
      var vm = this;
      console.dir(images);

      vm.images = images;
      vm.clearSearch = function() {
        vm.searchImagesBy = undefined;
        vm.sortOrder = 'name';
      };
      vm.deletePrint = function(image) {
        console.log('delete image');
      };
      vm.startNew = function() {
        console.log('new image');
        $state.go('images.new', {mode: 'new'});
      };
      vm.startEdit = function(image) {
        console.log('edit image',{mode: 'edit'});
        $state.go('images.edit', {id: image._id, mode: 'edit'});

      };
      vm.startClone = function(image) {
        console.log('clone image');
        $state.go('images.edit', {id: image._id, mode: 'clone'});
      };


      /*
      var display = {
        mode: 'list',
        toolbar: true,
        edit: false,
        display: false,
        list: true,
        show: false,
        toolbarCollapsed: false,

        imageMode: 'normal',
        sortOrder: 'name',
        lastMode: null,
        setMode: function(mode) {
          console.log('setDisplayMode: ' + mode);
          this.mode = mode;
        },
        startEdit: function() {
          this.lastMode = this.mode;
          this.mode = 'edit';
        },
        finishEdit: function(){
          this.mode = this.lastMode;
          this.imageMode = 'normal';
        },
        finishImageSelect: function(image) {
          this.imageMode = 'normal';
        }
      };

      var model = {
        images: imageSvc.query(),
        selectedItem: {},
        copyItem: {},
        // Start REST Services
        update: function() {
          //.update()
        },
        save: function() {

        },
        delete: function() {

        },
        // End REST Services
        edit: function(item) {
          this.selectedItem = item;
          this.copyItem = angular.copy(item);

        }

      };
      */
    }

})(window, window.angular);


