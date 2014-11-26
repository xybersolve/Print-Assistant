/*
  Gets directory of script (directive) when it loads
  Used to put templates in the same or child directory
*/
(function (window) {
  'use strict';

  window.xybo = window.xybo || {};
  xybo.getScriptDirectory = function(){
    var script = [].pop.call(document.getElementsByTagName('script'));
    var dir = script.src.slice(script.baseURI.length, (script.src.lastIndexOf('/') + 1) );
    return dir.length > 0 ? dir : '.';
  };
})(window);