(function (window, angular) {
  'use strict';

  angular
    .module('app.reconcile')

    .controller('ReconcileCtrl', ['_', 'printSvc', 'fieldSvc', 'reconcileSvc', 'reconcileCacheSvc', 'notifySvc', '$timeout', ReconcileCtrl]);
  function       ReconcileCtrl (   _ ,  printSvc,   fieldSvc,   reconcileSvc,   reconcileCacheSvc,   notifySvc,   $timeout) {

    var STATUS_KEY = 'status';
    var defaultStatus = ["On Display", "Back Stocked", "Sold-Pending"];

    var vm = this;
    vm.clearSearch = function() {
      vm.filterByLocation = undefined;
      vm.searchPrintsBy = undefined;
      vm.sortOrder = 'name';
      initialize();
    };
    vm.clearSearch();
    vm.filtered = undefined;
    vm.reconciled = [];

    //vm.prints = printSvc.query();
    vm.gotLocationChange = function() {
      // allow model to catch up
      $timeout(function() {
        if(vm.filterByLocation === undefined) {
          initialize();
        } else {
          load();
        }
      }, 100);
    };
    vm.reconcile = function(print) {
      if(! vm.filterByLocation ){
        notifySvc.error('Please, first select a "location" to reconcile.', 'Reconcile Warning');
      } else {
        vm.reconciled.push(print);
        vm.prints.splice(this.prints.indexOf(print), 1);
      }
    };
    vm.revert = function(print) {
       vm.prints.push(print);
       vm.reconciled.splice(this.reconciled.indexOf(print), 1);
    };
    vm.reset = function() {
      vm.clearSearch();
      initialize();
    };

    vm.selected = {
      status: []
    };
    vm.available = {
      status: []
    };

    // form field population
    fieldSvc.loadFields(vm, function() {
      for (var i = 0; i < vm.status.length; i++) {
        var s = vm.status[i];
        vm.available.status.push(s.status);
      }
      // filter out all non-displaying locations
      // #TODO: turn this into an Angular filter
      vm.locations = _.filter(vm.locations, function(location) {
        return location.displaying === true;
      });

      var status = reconcileCacheSvc.get(STATUS_KEY);
      vm.selected.status = ( status && status.length > 0 ) ? status : defaultStatus;

    });
    vm.gotStatusChange = function() {
      //TODO: fix stop this gap to prevent cache overwrite on first void change
      if(vm.selected.status.length !== 0){
        reconcileCacheSvc.set(STATUS_KEY, vm.selected.status);
      }
    };
    vm.save = function() {
      console.log('Saving Reconcile');
    };

    function load(){
      vm.prints = printSvc.query();
      vm.reconciled = [];
    }
    function initialize(){
      vm.prints = [];
      vm.reconciled = [];
    }
  }

})(window, window.angular);


