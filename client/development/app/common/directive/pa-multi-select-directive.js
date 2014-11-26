(function (window, angular) {
  'use strict';

  angular
    .module('app')
    .directive('paMultiSelect', function () {
      return {
        link: function (scope, element, attrs) {
          element.multiselect({
            buttonClass: 'btn',
            buttonWidth: 'auto',
            buttonContainer: '<div class="btn-group" />',
            maxHeight: false,
            buttonText: function(options) {
              if (options.length === 0) {
                return 'None selected <b class="caret"></b>';
              }
              else if (options.length > 3) {
                return options.length + ' selected  <b class="caret"></b>';
              }
              else {
                var selected = '';
                options.each(function() {
                  selected += $(this).text() + ', ';
                });
                return selected.substr(0, selected.length -2) + ' <b class="caret"></b>';
              }
            }
          });

          // Watch for any changes to the length of our select element
          scope.$watch(function (window, angular) {
            return element[0].length;
          }, function () {
            element.multiselect('rebuild');
          });

          // Watch for any changes from outside the directive and refresh
          scope.$watch(attrs.ngModel, function () {
            element.multiselect('refresh');
          });

        }

      };
    });

})(window, window.angular);