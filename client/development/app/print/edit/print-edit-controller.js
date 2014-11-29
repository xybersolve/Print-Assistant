(function (window, angular) {
  'use strict';

  angular
    .module('app.print')
    .controller('PrintEditCtrl', ['$rootScope', '$stateParams', 'printCacheSvc', 'images', PrintEditCtrl]);
    function     PrintEditCtrl(    $rootScope,   $stateParams,   printCacheSvc,   images) {
      var SHOW_PRICING_KEY = 'show-pricing';
      var modes = {
        new: 'Create New Print',
        clone: 'Clone Existing Print',
        edit: 'Edit Print'
      };
      var mode = $stateParams.mode;
      var vm = this;
      vm.images = images; // from router resolve
      vm.mode = mode;
      vm.title = modes[mode];
      vm.setImageMode = function(mode) {
        vm.imageMode = mode;
      };
      vm.setImageMode( (vm.mode==='new') ? 'select': 'display');
      vm.showPricing = printCacheSvc.get(SHOW_PRICING_KEY);
      vm.gotShowPricingChange = function() {
        printCacheSvc.set(SHOW_PRICING_KEY, vm.showPricing);
      };
      vm.goBack = function(){
        $rootScope.goBack();
      };
    }

})(window, window.angular);


