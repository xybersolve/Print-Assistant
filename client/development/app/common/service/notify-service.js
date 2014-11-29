(function (window, angular) {
  'use strict';
  angular
    .module('app.services')
    .factory('notifySvc',['toastr', notifySvc]);

  function notifySvc(toastr) {

    toastr.options = {
      closeButton: true,
      debug: false,
      positionClass: "toast-top-right",
      onclick: null,
      showDuration: "300",
      hideDuration: "1000",
      timeOut: "3000",
      extendedTimeOut: "1000",
      showEasing: "swing",
      hideEasing: "linear",
      showMethod: "fadeIn",
      hideMethod: "fadeOut"
    };

    return {
      info: function(msg, title) {
        toastr.info(msg, title);
      },
      success: function(msg, title) {
        toastr.success(msg, title);
      },
      warn: function(msg, title) {
        toastr.warning(msg, title);
      },
      error: function(msg, title) {
        toastr.error(msg, title);
      }
    };
  }
})(window, window.angular);


