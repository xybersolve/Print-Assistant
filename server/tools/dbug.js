var util = require('util');

exports.show = function(data){
  console.log(util.inspect(data, true, 10, true));
};
