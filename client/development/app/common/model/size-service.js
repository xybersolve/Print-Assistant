(function (window, angular) {
  'use strict';
  angular
    .module('app.services')
    .factory('sizeSvc', ['$resource', sizeSvc]);

  function sizeSvc($resource){
    var Size = $resource('/api/sizes/:id', {id: '@id'},{
      update: { method: 'PUT' },
      save  : { method: 'POST'}
    });
    Size.prototype.save = function() {
      return this.$save();
    };
    Size.prototype.update = function() {
      return this.$update({id: this._id});
    };
    return Size;
  }

})(window, window.angular);



