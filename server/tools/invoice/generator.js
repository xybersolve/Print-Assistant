var invoiceDirectory = '/var/www/PhotographyAssistant/server/tools/invoice/invoices'
  , phantom   = require('phantom')
  //, handlebars  = require('handlebars')
  , mailer      = require('nodemailer')
  , engine      = null
  , email       = null
  , wrap        = null
  , emailCfg    = null;

module.exports = function(cfg, dbWrap) { 'use strict';

  wrap = dbWrap;

  return {
    makeInvoice: function (name, data, cb) {
      // engine is specific to invoice selected
      data.user.phone = formatPhoneNumber(data.user.phone);
      data.client.phone1 = formatPhoneNumber(data.client.phone1);
      var engineFile = './engines/' + name;
      engine = require(engineFile);
      console.log('Making Invoice');
      var html = engine.buildTemplate(data);
      var email = engine.buildEMail(name, data);
      console.log('Converting to PDF');
      makePDF(html, function(err) {
        if(err) return cb(err);
        console.log('Sending Invoice');
        var sendOpts = {
          from:    makeEmailAddress(data.user),
          to:      makeEmailAddress(data.client),
          cc:      makeEmailAddress(data.user),
          subject: engine.emailSubject,
          text:    engine.emailText,
          email: email
        };
        sendInvoice(sendOpts, function(err, result) {
          if(err) return cb(err);
          console.log('Sent Invoice');
          cb(null, result);
        });
      });
    }
  };
  function makePDF(html, cb) {
    phantom.create(function (ph) {
      ph.createPage(function (page) {
        page.set('viewportSize', {width:800, height: 600});
        page.set('paperSize',{format:'A4', orientation:'portrait', border:'1cm'});
        page.set('content', html, function(err) {
          if(err) return cb(err);
        });
        page.render(invoiceDirectory + '/invoice.pdf', function () {
          //page.render(invoiceDirectory + 'google.pdf', function(){
          console.log('Page Rendered');
          ph.exit();
          cb(null);
        });
      });
    });
  }
  function formatPhoneNumber(phone){
    var work = phone + '';
    work = work.replace(/[^\d]/g,'');
    if(work.length === 10){
      return '(' + work.substring(0,3) + ')' + work.substring(3, 6) + '-' + work.substring(6);
    } else {
      return work;
    }
  }

  function makeEmailAddress(data){
    return data.firstName + ' ' + data.lastName + '<' + data.email + '>';
  }
  function sendInvoice(sendOpts, cb) {
    var transport = createTransport(emailCfg);
    var mailOpts = {
      to:      sendOpts.to,
      cc:      sendOpts.cc,
      from:    sendOpts.from,
      subject: sendOpts.subject,
      text:    sendOpts.text,
      html:    sendOpts.email,
      attachments: [
        {
          path: invoiceDirectory + '/invoice.pdf'
          //content: 'Print Invoice'
        }
      ]
    };
    /*
    var mailOpts = {
      to: 'milliganmedia.net@gmail.com',
      from: 'xybersolve@gmail.com',
      subject: 'Print Invoice',
      text: 'Please find attached an invoice for the prints currently on display.',
      html: email,
      attachments: [
        {
          path: invoiceDirectory + '/invoice.pdf'
          //content: 'Print Invoice'
        }
      ]
    };
    */
    transport.sendMail(mailOpts, function (err, info) {
      if (err) return cb(err);
      cb(null, info.response);
    });
  }

  function createTransport() {
    var emailCfg = cfg.email;
    var service = 'Gmail'
      , user = 'milliganmedia.net@gmail.com'
      , pass = emailCfg[service][user];

    var transport = mailer.createTransport({
      service: service,
      auth: {
        user: user,
        pass: pass
      }
    });
    return transport;
  }
  /*
  function assembleInvoice(name, data){
    preparePartials();
    var invoiceTmp = getTemplate('invoice.hbs');
    var invoice = handlebars.compile(invoiceTmp);
    return invoice(data);
  }

  function preparePartials() {
    var headerTmp = getTemplate('header.hbs');
    var ledgerTmp = getTemplate('ledger.hbs');
    var footerTmp = getTemplate('footer.hbs');
    handlebars.registerPartial('header', headerTmp);
    handlebars.registerPartial('ledger', ledgerTmp);
    handlebars.registerPartial('footer', footerTmp);
  }

  function getTemplate(template){
    return fs.readFileSync(templateDir + '/' + template , 'utf8');
  }*/

};