var mailer  = require('nodemailer');

module.exports = function(cfg){ 'use strict';

  var emailCfg = cfg.email;
  console.log('emailCfg');
  console.dir(emailCfg);

  return {
    send: function(body, cb) {
      var transport = createTransport(emailCfg);
      var mailOpts = {
        to: 'milliganmedia.net@gmail.com',
        from: 'xybersolve@gmail.com',
        subject: 'Print Invoice',
        text: 'Here is the invoice for the prints being sold on commission.',
        html: body
      };
      transport.sendMail(mailOpts, function (err, info) {
        if (err) return cb(err);
        cb(null, info.response);
      });
    }
  };

  function createTransport(cfg) {
    var service = 'Gmail'
      , user = 'milliganmedia.net@gmail.com'
      , pass = cfg[service][user];

    console.log('user: ' + user);
    console.log('pass: ' + pass);

    var transport = mailer.createTransport({
      service: service,
      auth: {
        user: user,
        pass: pass
      }
    });
    return transport;
  }

};
/*
var sendEmail = function() {
  var service = 'Gmail'
    , user = 'milliganmedia.net@gmail.com'
    , pass = cfg[service][user];

  console.log('user: ' + user);
  console.log('pass: ' + pass);

  var transport = mailer.createTransport({
    service: service,
    auth: {
      user: user,
      pass: pass
    }
  });

  var mailOpts = {
    to: 'milliganmedia.net@gmail.com',
    from: 'xybersolve@gmail.com',
    subject: 'Print Invoice',
    text: 'Here is the invoice for the prints being sold on commission.',
    html: '<h3>Invoice</h3></h3><p>Here is the invoice for the prints being sold on commission.</p>'
  };
  transport.sendMail(mailOpts, function(err, info) {
    if(err) return console.log(err);
    console.log(info.response);
  })
};

*/