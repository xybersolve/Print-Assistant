(function (window, angular) {
  'use strict';

  angular
    .module('app.services')
    .factory('leadSvc', ['$resource', leadSvc]);

  function leadSvc($resource){
    var Lead = $resource('/api/leads/:id', {id: '@id'},{
      update: { method: 'PUT' },
      save  : { method: 'POST'}
    });
    Lead.prototype.update = function() {
      return this.$update({id: this._id});
    };

    return Lead;
  }

})(window, window.angular);



