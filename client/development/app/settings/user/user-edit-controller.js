(function (window, angular) {
  'use strict';

  angular
    .module('app.settings')
    .controller('UserEditCtrl', ['$rootScope', 'notifySvc', 'userCacheSvc', 'userSvc', UserEditCtrl]);
  function       UserEditCtrl(    $rootScope,   notifySvc,   userCacheSvc,   userSvc) {
    var vm = this;

    userSvc.get({id: $rootScope.user._id}).$promise.then(function(data) {
      console.log('user from service');
      console.dir(data);
      vm.user = data;
    });

    vm.save = function() {
      var copyItem = angular.copy(vm.user);
      copyItem.update().then(function(result) {
        console.dir(result);
        if(result.success === true){
          notifySvc.success('Successfully saved user profile.');

        } else {
          notifySvc.error('Oops! there was a problem saving the user profile.');
        }
      });
    };
  }

})(window, window.angular);
