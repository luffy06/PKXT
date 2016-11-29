var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var multer = require('multer');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(session);

var dbUrl = 'mongodb://localhost/pkxt';

var user = require('./routes/user');
var course = require('./routes/course');

var app = express();

mongoose.Promise = global.Promise;
mongoose.connect(dbUrl);

// change To html 
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.engine('.html', require('ejs').renderFile);  
// app.set('view engine', 'html');  

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'pkxt',
  resave: false,
  saveUninitialized: true,
  store: new mongoStore({
    url: dbUrl,
    collection: 'sessions'
  })
}));

// 初始化，判断session中是否有用户
app.use(function(req, res, next) {
  var _user = req.session.user;
  if (_user)
    app.locals.user = _user;
  else
    delete app.locals.user;
  next()
});


app.use('/user', user);
app.use('/course', course);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// error handlers

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }

// production error handler
// no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });


module.exports = app;
