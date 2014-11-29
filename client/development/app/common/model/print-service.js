(function (window, angular) {
  'use strict';

  angular
    .module('app.services')
    .factory('printSvc', ['$resource', printSvc]);
  function    printSvc(    $resource){

    var Print = $resource('/api/prints/:id', {id:'@id'}, {
      update: {method: 'PUT'},
      save:   {method: 'POST'},
      delete: {method: 'DELETE'},
      prepPrint:{ method:'POST', url: '/api/prints/prep/print'}
    });
    Print.prototype.remove = function () {
      return this.$delete({id: this._id});
    };
    Print.prototype.update = function() {
      return this.$update({id: this._id});
    };
    return Print;
  }
})(window, window.angular);
