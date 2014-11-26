(function (window, angular) {
  'use strict';

  angular
    .module('app.settings')
    .controller('SizeMainCtrl', ['$state', '_', 'sizeSvc', SizeMainCtrl]);
  function       SizeMainCtrl (   $state,   _ , sizeSvc  ){
    var vm = this;
    sizeSvc.query().$promise.then(function(data) {
      vm.ratioSizePricing = data;

      var ratios = {};
      var sizeByRatio = [];
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if( ! ratios[item.ratio]) ratios[item.ratio] = [];
        var costAry  = expand(item.cost, 'material', 'cost');
        var priceAry  = expand(item.price, 'material', 'price');
        ratios[item.ratio].push({size: item.size, cost: costAry, price: priceAry});
      }
      for(var key in ratios){
        sizeByRatio.push({ratio: key, sizes: ratios[key] } );
      }
      vm.sizeByRatio = sizeByRatio;
      console.log('*****************************************');
      console.dir(sizeByRatio);
      console.log('*****************************************');
    });

    function expand(items, keyName, valueName){
      var ary = [];
      for(var k in items){
        var obj = {};
        obj[keyName] = k;
        obj[valueName] = items[k];
        ary.push(obj);
      }
      return ary;
    }
    //vm.status = status;
    vm.create = function() {};
    vm.delete = function() {};
    vm.edit = function(status) {
      $state.go('status', {id: status._id});
    };
  }
})(window, window.angular);
