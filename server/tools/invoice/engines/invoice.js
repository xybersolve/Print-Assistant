var  handlebars  = require('handlebars')
   , templates   = require('./../templates/templateProvider');

exports.emailSubject = 'Invoice Statement';
exports.emailText = 'Please find attached the invoice for prints currently on display. ' +
                    'Take a moment to check inventory against this statement. ' +
                    'If you notice in discrepancies, please contact me at your earliest convenience. ' +
  '\n\n' +
  'On long lists (over 40 items), the actual list may be found on the next page. ' +
  'Sorry for any inconvenience. We are working to fix it.';

exports.statementName = 'Invoice Statement';
exports.statementDesc = 'prints currently in inventory';

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
  var attributes = templates.getTemplate('attributes');
  var invoice = templates.getTemplate('invoice', 'invoice');
  var header = templates.getTemplate('header',   'invoice');
  var ledger = templates.getTemplate('ledger',   'invoice');
  var footer = templates.getTemplate('footer',   'invoice');
  handlebars.registerPartial('banner',  banner);
  handlebars.registerPartial('attributes',  attributes);
  handlebars.registerPartial('content', invoice);
  handlebars.registerPartial('header',  header);
  handlebars.registerPartial('ledger',  ledger);
  handlebars.registerPartial('footer',  footer);
}

