(function (window, angular) {
  'use strict';

  angular
    .module('app.services')
    .factory('invoiceSvc', ['$resource', invoiceSvc]);

  function invoiceSvc($resource){
    var Invoice = $resource('/api/invoices/:name',{name: '@name'}, {
      sendInvoice: { method: 'POST', url: '/api/invoices/invoice/send'},
      sendNamedInvoice: {method: 'POST', url: '/api/invoices/invoice/send/:name'}
    });
    Invoice.prototype.sendNamedInvoice = function() {
      console.log('sendNamedInvoice');
      //return this.$sendInvoice({name: this.name});
      return this.$sendNamedInvoice({name: this.name, year: this.year});
    };

    return Invoice;
  }

})(window, window.angular);



