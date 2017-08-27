(function (window, angular) {
  'use strict';

  angular
    .module('app.services')
    .factory('imageSvc', ['_', '$resource', '$http', imageSvc]);
  function    imageSvc(    _   ,$resource,   $http){

    var Image = $resource('/api/images/:id', {id: '@id'},{
      update: { method: 'PUT' },
      save  : { method: 'POST'},
      upload: { method: 'POST', url: '/api/images/upload'}
    });
    Image.prototype.update = function() {
      return this.$update({id: this._id});
    };
    Image.prototype.saveNew = function() {
      var url = '/api/images/';
      var self = this;
      // pull out the fileData
      //var fileData = _.pick(self, 'fileData');
      // strip out the file part - leaving image data
      //var image = _.omit(this, 'fileData');
      // the package
      //var data = {image: image, file: fileData};
      console.log('the data package');
      console.dir(data);
      // build an HTTP request to handle mutlipart data
      return $http({
        method: 'POST',
        url: url,
        // force to determine content-type
        headers: {'Content-Type': undefined},
        transformRequest: function(data) {
          var formData = new FormData();
          // add image part of object
          formData.append('image' , angular.toJson(image) );
          // only one file
          formData.append('file', self.fileData.file);
          return formData;
        },
        data: data
      });
    };

    Image.uploadImage = function(data) {
      console.log('Image.upload()');
      console.dir(data);
    };
    return Image;
  }

})(window, window.angular);



