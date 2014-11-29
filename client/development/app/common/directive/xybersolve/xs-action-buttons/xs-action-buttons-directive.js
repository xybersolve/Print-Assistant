(function (window, angular) {
  'use strict';

    // use xs-get-script-directory to get directive directory
  var widgetDirectory = xybo.getScriptDirectory();

  angular
    .module('xs.action-buttons', [])
    .directive('xsActionButtons', function() {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: widgetDirectory + '/xs-action-buttons-template.html',
        scope: {
          onDeleteConfirm: '&',
          onClone: '&',
          onEdit: '&',
          hasDelete: '=',
          hasClone: '=',
          hasEdit: '='
        },
        controller: function($scope) {
          $scope.isDeleting = false;
          $scope.startDelete = function() {
            $scope.isDeleting = true;
          };
          $scope.cancelDelete = function() {
            $scope.isDeleting = false;
          };
          $scope.confirmDelete = function() {
            $scope.isDeleting = false;
            $scope.onDeleteConfirm();
          };
          $scope.startEdit = function(){
            $scope.onEdit();
          };
          $scope.startClone = function(){
            $scope.onClone();
          };
        }
      };
    });

})(window, window.angular);
