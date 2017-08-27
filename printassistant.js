var express          = require('express')
  , app              = express()
  , bodyParser       = require('body-parser')
  , favicon          = require('serve-favicon')
  , methodOverride   = require('method-override')
  , errorHandler     = require('errorhandler')
  , jwt              = require('jsonwebtoken')
  , expressJwt       = require('express-jwt')
  , logger           = require('morgan')
  // ------------------------------------------------------------------------
  // site app specific modules
  , cfg              = require('./server/config/config')
  , mongoWrap        = require('./server/tools/mongowrap/mongo-wrap')(cfg.mongo)
  , routeLogger      = require('./server/middleware/route-logger')('')
  , authenticate     = require('./server/authorize/authenticate')(mongoWrap)
  , authorize        = require('./server/authorize/authorize')(authenticate)
  , invoiceGen        = require('./server/tools/invoice/generator')(cfg, mongoWrap)
  , initDB         = require('./server/tools/init-db')(mongoWrap)
  // ------------------------------------------------------------------------
  // mongoDB Native - data providers
  , printProvider    = require('./server/mongo-providers/print-provider')(mongoWrap)
  , printTools       = require('./server/mongo-providers/print-tools')(mongoWrap)
  , imageProvider    = require('./server/mongo-providers/image-provider')(mongoWrap)
  , leadProvider     = require('./server/mongo-providers/lead-provider')(mongoWrap)
  , actionProvider   = require('./server/mongo-providers/action-provider')(mongoWrap)
  , interestProvider = require('./server/mongo-providers/interest-provider')(mongoWrap)
  , statusProvider   = require('./server/mongo-providers/status-provider')(mongoWrap)
  , locationProvider = require('./server/mongo-providers/location-provider')(mongoWrap)
  , materialProvider = require('./server/mongo-providers/material-provider')(mongoWrap)
  , sizeProvider     = require('./server/mongo-providers/size-provider')(mongoWrap)
  , lineProvider     = require('./server/mongo-providers/line-provider')(mongoWrap)
  , reportProvider   = require('./server/mongo-providers/report-provider')(mongoWrap)
  , userProvider     = require('./server/mongo-providers/user-provider')(mongoWrap)
  , invoiceProvider  = require('./server/mongo-providers/invoice-provider')(mongoWrap)

  // ------------------------------------------------------------------------
  , errorHandler     = require('./server/middleware/error-handler')(process.env.NODE_ENV)
  , reqSession       = require('./server/middleware/req-session')(mongoWrap);
  // Reserved Modules
  //, compress       = require('compress')
  //, cors           = require('cors')

function runAfterDBConnect(){
  // routines to run after db & server initialization
}

// #TODO Production Environment Config
/* ---------------------------------------------------
Express setup
 */
var environ        = 'development'
  , port           = 8000
  , oneDay         = 86400000
  , rootPath;

// Reserved Utilities for Production Environments
//app.use(morgan('dev'));
//app.use(compress);
//app.use(cors());

rootPath = __dirname + cfg[environ].rootPath;

console.log('**********************************************************');
console.log('CURRENTLY OPERATING IN: ' + environ.toUpperCase() );
console.log('RootPath: ' + rootPath );
console.log('**********************************************************');

/* ---------------------------------------------------------
 Express Configuration
 */
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('X-HTTP-Override'));
app.use(express.static(rootPath, {maxAge:oneDay}));
app.use(favicon(rootPath + '/favicon.ico'));
app.use(expressJwt({secret:cfg.secret}).unless({path:['/api/login']}) );
// various custom middleware
app.use(reqSession);
app.use(errorHandler);


// #TODO Refactor out routes
/* ---------------------------------------------------------
 Express Route Assignment
 */
app.use('/',            require('./server/routes/index')());
app.use('/api/login',    require('./server/routes/login')(authenticate, cfg.secret));

app.use('/api/images',   require('./server/routes/images')   (imageProvider, rootPath));
app.use('/api/prints',   require('./server/routes/prints')   (printProvider)          );
app.use('/api/leads',    require('./server/routes/leads')    (leadProvider)         );
app.use('/api/actions',  require('./server/routes/actions')  (actionProvider)       );
app.use('/api/interests',require('./server/routes/interests')(interestProvider)     );
app.use('/api/locations',require('./server/routes/locations')(locationProvider)     );
app.use('/api/status',   require('./server/routes/status')   (statusProvider)       );
app.use('/api/materials',require('./server/routes/materials')(materialProvider)     );
app.use('/api/sizes',    require('./server/routes/sizes')    (sizeProvider)         );
app.use('/api/lines',    require('./server/routes/lines')    (lineProvider)         );
app.use('/api/users',    require('./server/routes/users')    (userProvider)         );
app.use('/api/reports',  require('./server/routes/reports')  (reportProvider)       );
app.use('/api/invoices', require('./server/routes/invoices') (invoiceProvider, invoiceGen)      );

// start app after db connection is established
mongoWrap.connect(function(err, db) {
  "use strict";
  if(err) throw err;
  app.listen(cfg.express.port);
  console.log('Started Local Server, Port:' + cfg.express.port);
  runAfterDBConnect();
});
exports = module.exports = app;

