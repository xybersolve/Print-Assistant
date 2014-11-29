(function (window, angular) {
  'use strict';

  angular
    .module('app.services')
    .factory('interestSvc', ['$resource', interestSvc]);

  function interestSvc($resource){
    var Interest = $resource('/api/interests/:id', {id: '@id'},{
      update: { method: 'PUT' },
      save  : { method: 'POST'}
    });
    Interest.prototype.update = function() {
      return this.$update({id: this._id});
    };
    return Interest;
  }

})(window, window.angular);



