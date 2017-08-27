var  handlebars  = require('handlebars')
   , templates   = require('./../templates/templateProvider');

exports.emailSubject = 'Reconcile Statement';
exports.emailText = 'Please find attached a reconcile statement for prints previously on display. ' +
  'These prints that should have been sold. ' +
  'Take a moment to check inventory against this statement. ' +
  'All of these prints should show as sold or be otherwise accounted. ' +
  'If you notice in discrepancies, please contact me at your earliest convenience. ' +
  '\n\n' +
  'On long lists (over 40 items), the actual list may be found on the next page. ' +
  'Sorry for any inconvenience. We are working to fix it.';

exports.statementName = 'Reconcile Statement';
exports.statementDesc = 'prints no longer in inventory';

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
  var invoice = templates.getTemplate('reconcile', 'invoice');
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

