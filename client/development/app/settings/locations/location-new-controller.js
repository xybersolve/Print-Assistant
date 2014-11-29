(function(window, angular){ 'use strict';

  angular
    .module('app.settings')
    .controller('LocationNewCtrl', ['$state',  'locationSvc', 'notifySvc', LocationNewCtrl]);
  function       LocationNewCtrl(    $state,    locationSvc,   notifySvc  ) {
    var vm = this;
    vm.location = new locationSvc();
    console.dir(vm.location);

    vm.save = function () {
      vm.location.$save().then(function (result) {
        console.dir(result);
        if (result) {
          notifySvc.success('Successfully created new location.');
        } else {
          notifySvc.error('Unable to create new location!');
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