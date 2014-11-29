(function (window, angular) {
  'use strict';

  angular
    .module('app.services')
    .factory('statusSvc', ['$resource', '$q', statusSvc]);
  function    statusSvc(    $resource,   $q){
    var Status = $resource('/api/status/:id', {id:'@id'}, {
      update: {method: 'PUT'},
      save:   {method: 'POST'},
      delete: {method: 'DELETE'}
    });
    Status.prototype.remove = function () {
      return this.$delete({id: this._id});
    };
    Status.prototype.update = function() {
      return this.$update({id: this._id});
    };
    return Status;
  }
})(window, window.angular);
