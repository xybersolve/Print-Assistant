(function (window, angular) {
  'use strict';

  angular
    .module('app.print')
    .controller('PrintToolbarCtrl', [PrintToolbarCtrl]);

  function PrintToolbarCtrl() {
    var vm = this;
    vm.buyer = {};
    vm.addNewBuyer = false;


  }

})(window, window.angular);
