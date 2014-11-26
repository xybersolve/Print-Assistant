(function (window, angular) {
  'use strict';

  angular
    .module('app.settings')
    .controller('StatusMainCtrl', ['$state', 'statusSvc', StatusMainCtrl]);
  function       StatusMainCtrl (   $state,   statusSvc  ){
      var vm = this;
      vm.status = statusSvc.query();

      vm.create = function() {};
      vm.delete = function() {};
      vm.edit = function(status) {
        $state.go('status', {id: status._id});
      };
    }
})(window, window.angular);
