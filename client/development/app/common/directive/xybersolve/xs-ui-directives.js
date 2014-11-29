(function (window, angular) {
 'use strict';

  angular.module('xs.ui.date.input', []);
  angular.module('xs.ui.select', []);
  angular.module('xs.ui.components', [
    'xs.ui.date.input',
    'xs.ui.select'
  ]);

  angular
    .module('xs.ui.date.input')
    .directive( 'xsDateInput', function (dateFilter) {
      return {
        restrict: 'A',
        require: 'ngModel',
        template: '<input type="date" />',
        replace: true,
        link: linkFn
      };
      function linkFn(scope, elm, attrs, ngModel) {
        function toView(modelValue) {
          try {
            return dateFilter(modelValue, 'yyyy-MM-dd');
          } catch(e){
            console.log('Error: ' + e);
          }
        }
        ngModel.$formatters.unshift( toView );

        function toModel(viewValue) {
          try {
            return new Date(viewValue).toISOString();
          } catch (e) {
            console.log('Error: ' + e);
          }
        }
        ngModel.$parsers.unshift( toModel );
      }
    });

  angular
    .module('xs.ui.select')
    .directive('select', function($interpolate) {
      //
      // Overrides HTML select tag to implement placeholder functionality
      // usage: (as normally (with "default-text" as placeholder
      //
      // <select ng-model="..."
      //         ng-options="for in as"
      //         default-text="My Un-selectable Text">
      //
      return {
        restrict: 'E',
        require: 'ngModel',
        link: function(scope, elem, attrs) {
          if(angular.isUndefined(attrs.defaultText)) return;
          scope.defaultText = attrs.defaultText || 'Select...';
          var defaultTemplate = '<option value="" disabled selected style="display:none;">{{defaultText}}</option>';
          elem.prepend($interpolate(defaultTemplate)(scope));
        }
      };
    });


})(window, window.angular);

/*
var ISO_DATE_REGEXP = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;
var URL_REGEXP = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;
var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
var NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/;
var DATE_REGEXP = /^(\d{4})-(\d{2})-(\d{2})$/;
var DATETIMELOCAL_REGEXP = /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/;
var WEEK_REGEXP = /^(\d{4})-W(\d\d)$/;
var MONTH_REGEXP = /^(\d{4})-(\d\d)$/;
var TIME_REGEXP = /^(\d\d):(\d\d)(?::(\d\d)(\.\d{1,3})?)?$/;
var DEFAULT_REGEXP = /(\s+|^)default(\s+|$)/;
*/