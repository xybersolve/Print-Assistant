(function (window, angular) {
  'use strict';
  angular
    .module('app.settings')
    .controller('SettingsMainCtrl', ['$rootScope', '$state', 'locationSvc', SettingsMainCtrl]);
  function       SettingsMainCtrl(    $rootScope,   $state,   locationSvc) {
    var vm = this;
    vm.exitFlag = false;
    vm.tabs =[
      {heading:'Locations', state:'settings.locations', active: true},
      {heading:'Lines', state:'settings.lines', active: false},
      {heading:'Status', state:'settings.status', active: false},
      {heading:'Sizes', state:'settings.sizes', active: false},
      {heading:'User', state:'settings.user', active: false}
    ];
    vm.go = function(state) {
      if(vm.exitFlag) return;
      $state.go(state);
      vm.tabs.forEach(function(tab) {
        tab.active = false;
      });
    };
    // fix for angular-ui tabs - sends "select" messages on unload
    $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {
      if(toState.name.indexOf('settings') === -1 ){
        vm.exitFlag = true;
      }
    });
  }
})(window, window.angular);
