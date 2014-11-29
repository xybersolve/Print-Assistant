(function (window, angular) {
  'use strict';

  angular
    .module('app.settings')
    .controller('LocationMainCtrl', ['$state', 'notifySvc', 'locationSvc', 'locations', LocationMainCtrl]);
  function       LocationMainCtrl(    $state,   notifySvc,   locationSvc,   locations ){
    var vm = this;
    //vm.locations = locations;
    //vm.totals = locationSvc.totals();
    locationSvc.getTotals().$promise.then(function(results) {
      vm.locations = results;
    });
    //vm.locations = locationSvc.totals();

    vm.delete = function(location) {
      console.dir(location);
      if(location.total !== 0){
        notifySvc.warn('Location used by ' + location.total + ' prints! Go to "Prints" and change location for these prints before deleting.' );
      } else {
        location.remove().then(function(code) {
          if(code.success === true){
            var index = vm.locations.indexOf(location);
            vm.locations.splice(index, 1);
          }
        });
      }
    };
    vm.edit = function(location) {
      $state.go('location.edit', {id: location._id});
    };
    vm.create = function() {
      $state.go('location.new');
    };
  }

})(window, window.angular);
