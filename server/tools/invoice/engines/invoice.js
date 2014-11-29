var  handlebars  = require('handlebars')
   , templates   = require('./../templates/templateProvider');

exports.emailSubject = 'Print Invoice';
exports.emailText = 'Please find attached an invoice for the prints currently on display.';

exports.buildTemplate = function(data) { 'use strict';
    preparePartials();
    var mainTmp = templates.getTemplate('main');
    var invoice = handlebars.compile(mainTmp);
    return invoice(data);
};

exports.buildEMail = function(name, data) { 'use strict';
  var emailTmp = templates.getEmailTemplate(name);
  var signature = templates.getEmailTemplate('signature');
  handlebars.registerPartial('signature', signature);
  var email = handlebars.compile(emailTmp);
  return email(data);
};

function preparePartials() { 'use strict';
  var banner = templates.getTemplate('banner');
  var invoice = templates.getTemplate('invoice', 'invoice');
  var header = templates.getTemplate('header',   'invoice');
  var ledger = templates.getTemplate('ledger',   'invoice');
  var footer = templates.getTemplate('footer',   'invoice');
  handlebars.registerPartial('banner',  banner);
  handlebars.registerPartial('content', invoice);
  handlebars.registerPartial('header',  header);
  handlebars.registerPartial('ledger',  ledger);
  handlebars.registerPartial('footer',  footer);
}

