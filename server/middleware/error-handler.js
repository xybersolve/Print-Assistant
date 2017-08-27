module.exports = function errorHandler(environment){  'use strict';
  var environ = environment;
  return function(err, req, res, next){
    var error = {};
    if(environ === 'development'){
      error = {message: err.message, error:err, success: false};
    } else {
      error = {message: err.message, error:{}, success: false};
    }
    console.error('Uncaught error on server');
    console.dir(error);
    res.status(err.status||500);
    res.json(error);
  };
};
