(function(window, angular){
  'use strict';

  angular
    .module('app.settings')
    .controller('LocationEditCtrl', ['$state',  'locationSvc', 'notifySvc', 'location', LocationEditCtrl]);
  function       LocationEditCtrl(    $state,    locationSvc,   notifySvc,   location) {
    var vm = this;
    var mode = locationSvc.getMode();
    vm.location = location;
    vm.save = function() {
      vm.location.update().then(function (code) {
        if (code.success) {
          var msg = 'Successfully updated ' + code.updated.locations + ' location.';
          if(code.updated)
            msg += ' and ' + code.updated.prints + ' prints.';

          notifySvc.success(msg);

        } else {
          notifySvc.error('Unable to update location!');
        }
      }).then(function () {
        vm.goBackToLocations();
      });
    };
    vm.cancel = function() {
      vm.goBackToLocations();
    };
    vm.goBackToLocations = function(){
      $state.go('settings.locations');
    };
  }

})(window, window.angular);