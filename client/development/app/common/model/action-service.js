(function (window, angular) {
  'use strict';

  angular
    .module('app.services')
    .factory('actionSvc', ['$resource', actionSvc]);

  function actionSvc($resource){
    var Action = $resource('/api/actions/:id', {id: '@id'},{
      update: { method: 'PUT' },
      save  : { method: 'POST'}
    });
    Action.prototype.update = function() {
      return this.$update({id: this._id});
    };
    return Action;
  }

})(window, window.angular);



