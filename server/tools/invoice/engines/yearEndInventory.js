var  handlebars  = require('handlebars')
  , templates   = require('./../templates/templateProvider');

// #TODO: Still to be built Sales Tax & Year End Inventory

exports.emailSubject = 'Year End Inventory & Sales';
exports.emailText = 'Please find attached a year end print inventory & sales calculations.';
exports.statementName = 'Year End Inventory & Sales';
exports.statementDesc = 'inventory & sales reckoning';

exports.buildTemplate = function(data) { 'use strict';
    // TODO: Make this directory dynamic off __dirname
    preparePartials();
    var mainTmp = templates.getTemplate('main');
    var invoice = handlebars.compile(mainTmp);
    return invoice(data);
};

exports.buildEMail = function(name, data) { 'use strict';
  var emailTmp = templates.getEmailTemplate(name);
  var email = handlebars.compile(emailTmp);
  return email(data);
};
function preparePartials() {
  var banner = templates.getTemplate('banner');
  var attributes = templates.getTemplate('attributes');
  var header = templates.getTemplate('header', 'inventory');
  var ledgerTmp = templates.getTemplate('ledger', 'inventory');
  var invoice = templates.getTemplate('invoice', 'invoice');
  var footer = templates.getTemplate('footer', 'inventory');


  handlebars.registerPartial('banner',  banner);
  handlebars.registerPartial('header',  header);
  handlebars.registerPartial('attributes',  attributes);
  handlebars.registerPartial('ledger', ledgerTmp);
  handlebars.registerPartial('content', invoice);
  handlebars.registerPartial('footer', footer);
}
