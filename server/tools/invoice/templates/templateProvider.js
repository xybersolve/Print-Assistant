// TODO: Make this directory dynamic off __dirname
var templateDir = '/var/www/PrintAssistant/server/tools/invoice/templates'
  , commonDir   = templateDir + '/common'
  , emailDir    = templateDir + '/emails'
  , fs          = require('fs');

exports.getTemplate = function(template, name) { 'use strict';
  var dir = name ? templateDir + '/' + name : commonDir;
  var filePath = dir + '/' + template + '.hbs';
  return fs.readFileSync(filePath, 'utf8');
};

exports.getEmailTemplate = function(name) { 'use strict';
  var filePath = emailDir + '/' + name + '.hbs';
  return fs.readFileSync(filePath, 'utf8');
};