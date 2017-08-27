(function(window, angular){ 'use strict';

  angular
    .module('app.print')
    .controller('PrintCtrl', ['$rootScope', '$state', '_', 'printCacheSvc', 'invoiceSvc', 'printSvc', 'fieldSvc', 'notifySvc', 'prints', PrintCtrl]);
  function       PrintCtrl(    $rootScope, $state,     _ ,  printCacheSvc,   invoiceSvc,   printSvc,   fieldSvc,   notifySvc,   prints){

    /*
    #TODO: Refactor currently bloated controller to a Toolbar control
    */
    var STATUS_KEY = 'status';
    var LOCATION_KEY = 'location';
    var SEARCH_KEY = 'key';

    var defaultStatus = ["On Display", "Back Stocked", "Sold-Pending"];
    var requiredFields = ['name','material','size','status', 'location'];

    function validDateForm(print){
      return _.every(requiredFields, function(req) {
        if(! print.hasOwnProperty(req)) return false;
        return !(_.isEmpty(print[req]) || _.isUndefined(print[req]));
      });
    }

    var vm = this;
    vm.initialChange = true;
    // prints from appRoute - resolve
    vm.prints =  prints;
    vm.filtered = undefined;
    // persistent record handling
    // avoids reloading print list between edits
    // 'selectedItem' becomes 'copyItem' during edit
    function makePrint(print){
      var newPrint = print ? print : new printSvc();
      newPrint.date = newPrint.date ? newPrint.date : new Date().toISOString();
      return angular.copy(newPrint);
    }
    vm.startNew = function () {
      vm.mode = 'new';
      vm.copyItem = makePrint();
      $state.go('prints.edit', {printId: null, mode:'new'});
    };
    vm.startClone = function (print) {
      vm.mode = 'clone';
      vm.selectedItem = print;
      vm.copyItem = makePrint(print);
      $state.go('prints.edit', {printId: print._id, mode:'clone'});
    };
    vm.startEdit = function (print) {
      vm.mode = 'edit';
      vm.selectedItem = print;
      vm.copyItem = makePrint(print);
      $state.go('prints.edit', {printId: print._id, mode: 'edit'});
    };
    vm.changeImage = function (image) {
      vm.copyItem.imageId = image.imageId;
      vm.copyItem.fileStub = image.fileStub;
      vm.copyItem.name = image.name;
    };
    /*
     Print Edit depends on
     Print Edit, Save & Delete Methods
    */
    vm.deletePrint = function(print){
      print.remove().then(function (result) {
        if(result.success === true) {
          var index = vm.prints.indexOf(print);
          vm.prints.splice(index, 1);
        }
      });
    };
    vm.savePrint = function () {
      var copyItem = vm.copyItem;
      if(! validDateForm(copyItem)) {
        notifyFailure('All "required" fields must be supplied to save print.');
        return;
      }

      if(vm.mode==='new' || vm.mode==='clone'){
        copyItem.$save().then(function(result) {
          if(result) {
            notifySuccessSave('created new');
            vm.prints.push(result);
            vm.goBack();
          } else {
            notifyFailure();
          }
        });

      } else if (vm.mode==='edit'){
        copyItem.update().then(function(result) {
          if(result.success === true){
            notifySuccessSave('updated');
            angular.copy(copyItem, vm.selectedItem);
            vm.goBack();
          } else {
            notifyFailure();
          }
        });
      }
    };
    vm.goBack = function(){
      $rootScope.goBack();
    };
    function notifySuccessSave(action){
      notifySvc.success('Successfully ' + action + ' print in the database.');
    }
    function notifyFailure(err){
      var msg = err ? err: 'An error occurred while trying to save print!';
      notifySvc.error('Oops! ' + msg);
    }

    // Toolbar and Display depend on
    // Display Option Methods & Properties
    vm.sortOrder = 'name'; //sortOrder: 'sizeSort',
    vm.setSortOrder = function (sortOrder) {
      vm.sortOrder = sortOrder;
    };
    // initialize and reset search attributes
    vm.clearSearch = function() {
      vm.searchPrintsBy = undefined;
      vm.filterByStatus = undefined;
      vm.filterByLocation = undefined;
      vm.filterByLine = undefined;
    };
    // initialize search filter attributes
    vm.clearSearch();

    // field values for filter and edit modes
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
      rememberLastSettings();

      // filter out all non-displaying locations
      // #TODO: turn this into an Angular filter
      vm.locations = _.filter(vm.locations, function(location) {
        return location.displaying === true || location.active === true;
      });
    });
    //*********************************************************
    // Remember Setting with Print Cache
    //
    //  * Note: Currently pulled remember on "location" and "search"

    function rememberLastSettings(){
      var status = printCacheSvc.get(STATUS_KEY);
      vm.selected.status = (status && status.length > 0) ? status : defaultStatus;
      //var filterByLocation = printCacheSvc.get(LOCATION_KEY);
      //vm.filterByLocation = printCacheSvc.get(LOCATION_KEY);
      //var searchPrintsBy = printCacheSvc.get(SEARCH_KEY);
      //vm.searchPrintsBy = printCacheSvc.get(SEARCH_KEY);
    }
    /*
    vm.gotLocationChange = function() {
      setTimeout(function() {
        printCacheSvc.set(LOCATION_KEY, vm.filterByLocation);
      }, 0);
    };

    vm.gotSearchChange = function () {
      setTimeout(function() {
        printCacheSvc.set(SEARCH_KEY, vm.searchPrintsBy);
      }, 0);
    };
    */

    //
    // End Remember Setting
    //*********************************************************
    vm.isSaleStatus = function() {
      //return ( ['Sold-Pending', 'Sold-Received'].indexOf(vm.copyItem.status) !== -1 )
      return true;
    };
    vm.isPrivateSale = function () {
      // these locations give us editable
      return ( ['Commercial Buyer', 'Private Buyer', 'MM Shop'].indexOf(vm.copyItem.location) !== -1);
    };

    vm.gotCommissionPercentChange = function() {
      // only changes it superficially for interface
      // all real price computation is handled on server
      vm.copyItem.price.profit = parseFloat(vm.copyItem.price.price * vm.copyItem.commissionPercent / 100).toFixed(2);

    };
    vm.gotStatusChange = function() {
      // fix stop this gap to prevent cache overwrite on first void change
      if(vm.selected.status.length !== 0){
        printCacheSvc.set(STATUS_KEY, vm.selected.status);
      }
    };

    vm.gotPrintPrepEvent = function() {
      vm.copyItem.$prepPrint().then(function(result) {
        angular.extend(vm.copyItem, result.print);
        console.dir(vm.copyItem);
      });
    };
    vm.invoice = function() {
      // invoice sends PDF to owner and Location contact
      var prints = vm.filtered;
      var invoice = new invoiceSvc();
      var copy = angular.copy(invoice);
      copy.name = 'invoice';
      copy.inventory = [];
      angular.forEach(vm.filtered, function(print) {
        copy.inventory.push(print._id);
      });
      copy.location = vm.filterByLocation;
      //invoice.status = 'On Display';
      copy.status = vm.selected.status;
      //copy.$sendInvoice().then(function(result) {
      copy.sendNamedInvoice().then(function(result) {
        if(result.success === true){
          notifySvc.success('Successfully sent invoice to buyer and user.');
        } else {
          notifySvc.error('Oops! There was an error sending the invoice.');
        }
      });
    };

  }
})(window, window.angular);

