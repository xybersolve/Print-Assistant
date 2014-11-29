(function (window, angular) {
  'use strict';

  angular
    .module('app.services')
    .factory('locationSvc', ['$resource', '$http', '$q', locationSvc]);
  function    locationSvc(    $resource,   $http ,  $q){
    var editMode = null;
    var Location = $resource('/api/locations/:id', {id:'@id'}, {
      update: {method: 'PUT'},
      save:   {method: 'POST'},
      delete: {method: 'DELETE'},
      totals: {method: 'GET', url:'/api/locations/extended/totals', isArray: true}
    });
    Location.prototype.remove = function () {
      return this.$delete({id: this._id});
    };
    Location.prototype.update = function() {
      return this.$update({id: this._id});
    };
    Location.getTotals = function () {
      // non-REST end point
      // /locations/extended/totals
      return this.totals();
    };
    Location.saveLocation = function () {
      if(editMode==='edit'){
        return this.$update({id: this._id});
      } else if (editMode==='new'){
        return this.$save();
      }
    };
    Location.setMode = function (mode) {
      editMode = mode;
    };
    Location.getMode = function() {
      return editMode;
    };
    return Location;
  }
})(window, window.angular);


/*
app.print.factory('printSvc', ['$resource', function($resource) {
  var Print = $resource('/prints/:id', {id:'@id'}, {
    update: {method: 'PUT'},
    save:   {method: 'POST'}
  });
  Print.prototype.fetchAll = function() {
    return this.query();
  };
  Print.prototype.save = function() {
    console.log('Print.save()');
    this.$save();
  };
  Print.prototype.update = function() {
    // do some validation and auth
    // return the promise
    return this.$update({id: this._id})
  };
  Print.prototype.create = function() {
    // do some validation and auth
    // return the promise
    return this.$post({id: this._id})
  };
  return Print;
}]);
*/