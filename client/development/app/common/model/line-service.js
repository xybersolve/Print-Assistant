(function (window, angular) {
  'use strict';
  angular
    .module('app.services')
    .factory('lineSvc', ['$resource', lineSvc]);

  function lineSvc($resource){
    var Line = $resource('/api/lines/:id', {id: '@id'},{
      update: { method: 'PUT' },
      save  : { method: 'POST'}
    });
    Line.prototype.save = function() {
      return this.$save();
    };
    Line.prototype.update = function() {
      return this.$update({id: this._id});
    };
    return Line;
  }

})(window, window.angular);



