(function (window, angular) {
  'use strict';

  angular
    .module('app.services')
    .factory('userSvc', ['$http', 'userCacheSvc', '$resource', userSvc]);
  function    userSvc (   $http,   userCacheSvc,   $resource){

    var User = $resource('/api/users/:id', {id: '@id'},{
      update: { method: 'PUT' },
      save  : { method: 'POST'}
    });
    User.prototype.update = function() {
      return this.$update({id: this._id});
    };
    return User;
}

})(window, window.angular);

