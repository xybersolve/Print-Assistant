// TODO: Make this directory dynamic off __dirname
// TODO: Enable test mode - invoices sent to development only
var invoiceDirectory = '/var/www/PrintAssistant/server/tools/invoice/invoices'
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
      if(data.user && data.user.phone){
        data.user.phone = formatPhoneNumber(data.user.phone);
      }

      // for debug mode, where user has a singular phone
      if(data.client && (data.client.phone1 || data.client.phone)){
        var clientPhone = (data.client.phone1) ? data.client.phone1 : data.client.phone;
        data.client.phone1 = formatPhoneNumber(clientPhone);
      }

      console.log('Loading Invoice Engine');
      var engineFile = './engines/' + name;
      engine = require(engineFile);
      // populate template attributes
      data.statementName = engine.statementName ? engine.statementName : '';
      data.statementDesc = engine.statementDesc ? engine.statementDesc : '';
      var today = new Date();
      data.today = today.toLocaleDateString();

      console.log('Making Invoice');
      var html = engine.buildTemplate(data);
      var email = engine.buildEMail(name, data);

      console.log('Converting to PDF');
      makePDF(html, function(err) {
        if(err) return cb(err);

        console.log('Sending Invoice');
        var sendOpts = configureEmail(cfg, data);
        sendInvoice(sendOpts, function(err, result) {
          if(err) return cb(err);
          console.log('Sent Invoice');
          cb(null, result);
        });
      });
    }
  };
  function configureEmail(cfg, data){
    var sendOpts = {
      from:    makeEmailAddress(data.user),
      to:      makeEmailAddress(data.client),
      cc:      makeEmailAddress(data.user),
      subject: engine.emailSubject,
      text:    engine.emailText,
      email: email
    };
    // debug mode send to developer (user)
    if(cfg.invoice.debugMode===true) {
      console.log('Sending Development Invoice Only');
      sendOpts.to =  makeEmailAddress(data.user);
    }
    return sendOpts;
  }
  function makePDF(html, cb) {
    phantom.create(function (ph) {
      ph.createPage(function (page) {
        page.set('viewportSize', {width:800, height: 600});
        page.set('paperSize',{format:'A4',
                              orientation:'portrait',
                              footer:'0cm',
                              margin:{
                                left:'1cm',
                                right:'1cm',
                                top:'.5cm',
                                bottom:'.15cm'
                              }
        });

        page.set('content', html, function(err) {
          if(err) return cb(err);
        });
        page.render(invoiceDirectory + '/invoice.pdf', function () {
          console.log('Page Rendered');
          ph.exit();
          cb(null);
        });
      });
    });
    /*
    var wkhtmltopdf = require('wkhtmltopdf');
    var fs = require('fs');
    var r = wkhtmltopdf(html, { pageSize: 'letter' })
      .pipe(fs.createWriteStream(invoiceDirectory + '/invoice.pdf'));

    r.on('end', function () {
      cb(null)
    });
    */


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


/*
// html2pdf.js
var page = new WebPage();
var system = require("system");
// change the paper size to letter, add some borders
// add a footer callback showing page numbers
page.paperSize = {
  format: "Letter",
  orientation: "portrait",
  margin: {left:"2.5cm", right:"2.5cm", top:"1cm", bottom:"1cm"},
  footer: {
    height: "0.9cm",
    contents: phantom.callback(function(pageNum, numPages) {
      return "
      " + pageNum +
      " / " + numPages + "
      ";
    })
  }
};


page.zoomFactor = 1.5;
// assume the file is local, so we don't handle status errors
page.open(system.args[1], function (status) {
  // export to target (can be PNG, JPG or PDF!)
  page.render(system.args[2]);
  phantom.exit();
});
*/