(function (window, angular) {
  'use strict';

  angular
    .module('app.services')
    .factory('imageSvc', ['$resource', imageSvc]);

  function imageSvc($resource){
    var Image = $resource('/api/images/:id', {id: '@id'},{
      update: { method: 'PUT' },
      save  : { method: 'POST'},
      upload: { method: 'POST', url: '/api/images/upload'}
    });
    Image.prototype.update = function() {
      return this.$update({id: this._id});
    };
    Image.uploadImage = function(data) {
      console.log('Image.upload()');
      console.dir(data);
      
    };
    return Image;
  }

})(window, window.angular);



