var  handlebars  = require('handlebars')
  , templates   = require('./../templates/templateProvider');

// #TODO: Still to be built Sales Tax & Year End Inventory

module.exports = function(){ 'use strict';
  return {
    buildTemplate: function(data) {
      var commonDir = '/var/www/PhotographyAssistant/server/tools/invoice/templates/common';
      var templateDir = '/var/www/PhotographyAssistant/server/tools/invoice/templates/invoice';

      preparePartials();
      var invoiceTmp = templates.getTemplate('invoice.hbs');
      var invoice = handlebars.compile(invoiceTmp);
      return invoice(data);
    }
  };
  function preparePartials() {
    var headerTmp = templates.getTemplate('header.hbs');
    var ledgerTmp = templates.getTemplate('ledger.hbs');
    var footerTmp = templates.getTemplate('footer.hbs');
    handlebars.registerPartial('header', headerTmp);
    handlebars.registerPartial('ledger', ledgerTmp);
    handlebars.registerPartial('footer', footerTmp);
  }

};