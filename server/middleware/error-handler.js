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
/*
app.use(function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
});
app.use(function restErrorHandler (err, req, res, next) {
  res.status(500).json({ status:500, message: 'Internal Error', success: false, type: 'internal', err: err});
  res.end();
});
*/


