(function (window, angular) {
  'use strict';

  angular
    .module('app.services')
    .factory('reconcileSvc', ['$resource', reconcileSvc]);

    function reconcileSvc($resource) {
      var Reconcile = $resource('/reconcile/:id', {id:'@id'}, {
        update: {method: 'PUT'},
        save:   {method: 'POST'}
      });
      Reconcile.prototype.save = function() {
        this.$save();
      };
      Reconcile.prototype.update = function() {
        // do some validation and auth
        // return the promise
        return this.$update({id: this._id});
      };
      Reconcile.prototype.create = function() {
        // do some validation and auth
        // return the promise
        return this.$post({id: this._id});
      };
      return Reconcile;
    }
})(window, window.angular);


