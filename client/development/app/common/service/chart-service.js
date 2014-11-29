(function (window, angular) {
  'use strict';
  angular
    .module('app.reports')
    .factory('chartSvc', chartSvc);

  function chartSvc() {
    //chartType: pie, bar, line, point, area
    var colorSets = {
      blueMonochrome: ['#0F487F', '#346DA4', '#5891C8', '#7CB5EC', '#A0D9FF', '#C4FDFF'],
      monoMixed:['#1A3B6E','#206CC0','#7FABE8','#D0DFF6','#760F12','#DA311E','#F78560','#F3D5CB','#345E1C','#62A82E','#A1D269','#D9EBD1'],
      monoMixedContrast: ['#1F357E','#DA311E','#006A39','#D7301D','#432E6F'],
      monoBlueContrast: ['#1A3B6E','#206CC0','#7FABE8','#2E1D47','#6746A1','#C8C0E9'],
      houseSpecial: ['#7CB5EC', '#434348', '#90ED7D', '#F7A35C', '#8085E9'],
      //colorWheel: ['#0000FE','#4F2BB1','#7E23AE','#E70D88','#FE0000','#F74600','#FF7F00','#FFCC00','#FEF200','#7BFE00','#00FF01','#00DDDE'],
      colorWheelPastel: ['#6665FE', '#6566D0', '#A966D0', '#E7669C', '#FF6766', '#FF9063', '#FFB461', '#FFE15B', '#FEF995', '#C6FF94', '#00FF57', '#43FFFF'],
      colorWheel: ['#1B539E', '#0071B5', '#018DC8', '#01A8DD', '#6FA142', '#8BBF43', '#CBD833', '#993124', '#BE292D', '#EA2E2D', '#ED662F', '#F6BF24', '#FCE92B'],
      contrast: ['#1B539E', '#983023', '#F5C024', '#8BBF40'],
      interiorDesign: ['#052649', '#9E8E91', '#D4B6BE', '#FED7B8', '#074901', '#97A625', '#D8DB58', '#FFE284', '#B23600', '#FFD531', '#FFFA7D', '#0C0912', '#9A5B76', '#D27FAB', '#FEBAB1'],
      interiorContrast: ['#08264A','#9B9B69','#9B5F78','#FADB33'],
      interiorContrast2: ['#062150','#920900','#9BA423','#9A5F73']
    };
    var defaultConfig = {
      title: 'Generic Report Chart',
      tooltips: true,
      labels: false, // labels on data points
      // exposed events
      mouseover: function() {},
      mouseout: function() {},
      click: function() {},
      // legend config
      legend: {
        display: true, // can be either 'left' or 'right'.
        position: 'right'
      },
      // #F4A15B  highlight - line
      // '#7CB5EC', '#434348', '#90ED7D', '#F7A35C', '#8085E9', // highcharts pie
      // '#0F487F', '#346DA4', '#5891C8', '#7CB5EC', '#A0D9FF', '#C4FDFF' // blue monochrome
      // #9BC6EF, #707074, #AAF09C, #F8B883 // area
      colors: ['#7CB5EC', '#434348', '#90ED7D', '#F7A35C', '#8085E9'],
      innerRadius: 0,            // Only on pie Charts
      lineLegend: 'lineEnd',     // Only on line Charts
      lineCurveType: 'cardinal', // change this as per d3 guidelines to avoid smoothline
      isAnimate: true,           // run animations while rendering chart
      yAxisTickFormat: 's'       //refer tickFormats in d3 to edit this value
    };

    // the revealed interface
    return {
      setConfig: setConfig,
      defaultColors: {
        large: 'monoMixed',
        small: 'monoBlueContrast'
      }
    };

    function setConfig(opts) {
      if(opts.colorSet){
        opts.colors = colorSets[opts.colorSet];
      }
      return angular.extend({}, defaultConfig, opts);
    }
  }

})(window, window.angular);
