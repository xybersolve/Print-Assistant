/*
  CLI-msg
   -- formatted messaging for node command line scripting
   -- provides exit logic with process.exit()
 */
var util = require('util')
  , _    = require('underscore')
  , defaultLineLength = 50;

exports.showObject = function(obj){ 'use strict';
  return util.inspect(obj, true, 10, true);
};
exports.usage = function(syntax, exitCode){ 'use strict';
  drawLine();
  console.log('Usage warning from script: ');
  console.log('Syntax: node addUser name, email, password, role');
  console.log( syntax);
  drawLine();
  if(exitCode !== undefined) process.exit(exitCode);
};
exports.warning = function(msg, exitCode){ 'use strict';
  drawLine();
  console.log('Warning from script: ');
  console.log(msg);
  drawLine();
  if(exitCode !== undefined) process.exit(exitCode);
};
exports.error = function(msg, exitCode){ 'use strict';
  drawLine();
  console.log('Error in script: ');
  console.log(msg);
  drawLine();
  if(exitCode !== undefined) process.exit(exitCode);
};
exports.info = function(msg, exitCode){ 'use strict';
  drawLine();
  console.log('Information: ');
  console.log(msg);
  drawLine();
  if(exitCode !== undefined) process.exit(exitCode);
};

function drawLine(size){ 'use strict';
  var times = size || defaultLineLength;
  var line = '';
  var symbol = '*';
  _.times(times, function(){
      line += symbol;
  });
  console.log(line);
}