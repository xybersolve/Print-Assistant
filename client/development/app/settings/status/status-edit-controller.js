(function (window, angular) {
  'use strict';

  angular
    .module('app.settings')
    .controller('StatusEditCtrl', ['$state', 'statusSvc', 'notifySvc', 'status', StatusEditCtrl]);
  function       StatusEditCtrl (   $state,   statusSvc ,  notifySvc ,  status  ){
    var vm = this;
    vm.status = status;

    vm.save = function () {
      vm.status.update.then(function(code) {
        if(code.success === true){
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
