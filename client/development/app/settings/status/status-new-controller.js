(function (window, angular) {
  'use strict';

  angular
    .module('app.settings')
    .controller('StatusNewCtrl', ['$state', 'notifySvc', 'statusSvc', StatusNewCtrl]);
  function       StatusNewCtrl(    $state,   notifySvc,   statusSvc){
    var vm = this;
    vm.status = new statusSvc();

    vm.save = function () {
      vm.status.$save.then(function(result) {
        if(result){
          notifySvc.success('Successfully created the new status.');
        } else {
          notifySvc.error('Unable to create status!');
        }
      });
      vm.goBackToStatusList();
    };
    vm.cancel = function() {
      vm.goBackToStatusList();
    };
    vm.goBackToStatusList = function () {
      $state.go('settings.status');
    };
  }
})(window, window.angular);
