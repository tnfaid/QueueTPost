var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongo = require('mongoskin'); 
var busboy = require("connect-busboy");

var config = require('./config/index');
var routes = require('./routes/index');
var users = require('./routes/users');





var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret:'ssshhhhh'}));
app.use(busboy());

var db ={};
var dbmbedq ={};
var ipserver=config.local.ipserver;

console.log( config.local.mongo.login + '@' + config.local.mongo.host+':'+config.local.mongo.port+'/'+config.local.mongo.collection);
db = mongo.db('mongodb://' + config.local.mongo.login + '@' + config.local.mongo.host+':'+config.local.mongo.port+'/'+config.local.mongo.collection, {native_parser:true});

dbmbedq = mongo.db('mongodb://' + config.mbedq.mongo.login + '@' + config.mbedq.mongo.host+':'+config.mbedq.mongo.port+'/'+config.mbedq.mongo.collection, {native_parser:true});

var checkLogin = function(req,res,next){
	//console.log(req.protocol + '://' + req.get('host'))
	if (req.session.userLogin){
		if(req.session.userLogin.firstLogon){
			authorize.changepwdindex(req,res,next);
		}else{
			next();	
		}
	}else{
		authorize.index(req,res,next);
	}
};

var attachDB = function(req,res,next){
    req.db = db;
    req.dbmbedq =dbmbedq;
    req.ipserver = ipserver;
    //console.log('55555555',req.db);
    next();
};

// POM

var authorize = new require('./routes/login');
var branch = new require('./routes/branch');
var confRole = new require('./routes/Config_Role');
//var db_central_account  = require ('./routes/central_account');

// report
var reports = require('./routes/Reports');
app.use('/reports',attachDB,checkLogin,reports);

app.get('/login',attachDB,authorize.index);
app.post('/login',attachDB,authorize.login);
app.get('/logout',authorize.logout);
app.all('/index',attachDB,checkLogin,routes);
app.get('/changepwd',attachDB,authorize.changepwdindex);
app.post('/changepwd',attachDB,authorize.changepwd);
//-------------

//app.all('/config/account',attachDB,checkLogin,db_central_account.index);
//app.all('/config/ac_dataval',attachDB,checkLogin,db_central_account.getbranch);
//app.get('/config/ac_searchbranch',attachDB,checkLogin,db_central_account.SearchBranch);
//app.all('/config/account-find',attachDB,checkLogin, function(req,res,next){
//var path = __dirname +  "/public";
//req.pathWrite = path; 
//db_central_account.CentralAccount(req, res, next);
//});

//-------------

app.get('/config/role',attachDB,checkLogin,confRole.index);
app.get('/config/role/:action',attachDB,checkLogin,confRole.modifydata);
app.get('/config/role/:action/:id',attachDB,checkLogin,confRole.modifydata);
app.post('/config/role/:action',attachDB,checkLogin,confRole.editDB);


//-------------

app.get('/config/branch',attachDB,checkLogin,branch.index);
app.get('/config/branch/all',attachDB,checkLogin,branch.all);
app.all('/config/branch/:action/:id',attachDB,checkLogin,branch.modifydata);

//--------Dashboard---------//
//By Boy on Feb 16,2017
var dash = new require('./routes/dashboard_posid');

app.all('/dashboard/find',attachDB,checkLogin,dash.find);
app.all('/dashboard/getBranch',attachDB,checkLogin,dash.getBranch);
app.all('/dashboard/exportxls',attachDB,checkLogin,function(req,res){
	req.pathfile = __dirname +  "/public";
	dash.exportXLS(req,res);
});
app.all('/dashboard',attachDB,checkLogin,dash.index);

//-------User Management-------//
var user = new require('./routes/central_account');
app.all('/config/central_account',attachDB,checkLogin,user.index);
app.all('/config/central_account_search',attachDB,checkLogin,user.search);
app.all('/config/central_account_resetpass',attachDB,checkLogin,user.resetpass);
app.all('/config/central_account_deleteuser',attachDB,checkLogin,user.deleteuser);

var useradd = new require('./routes/central_account_add');
app.get('/config/central_account_add',attachDB,checkLogin,useradd.index);
app.all('/config/central_account_add_role',attachDB,checkLogin,useradd.role);
app.all('/config/central_account_add_find',attachDB,checkLogin,useradd.find);
app.all('/config/central_account_add_insert',attachDB,checkLogin,useradd.insert);

var useredit = new require('./routes/central_account_edit');
app.all('/config/central_account_edit/:id',attachDB,checkLogin,useredit.edit);
app.all('/config/central_account_edit_find',attachDB,checkLogin,useredit.find_id);
app.all('/config/central_account_edit_role',attachDB,checkLogin,useredit.role);
app.all('/config/central_account_edit_update',attachDB,checkLogin,useredit.find_update);

//-----------------------------------
app.use('/',attachDB,checkLogin, routes);

//-------------------


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
