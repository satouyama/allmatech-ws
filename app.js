var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swaggerJSDoc = require('swagger-jsdoc');
var cors = require('cors');
var jwt = require('jsonwebtoken');
var passport = require('passport');



var admin = require('./routes/admin');


var app = express();




//Incluir cors
app.use(cors());
var rdb = require('./models/rdb');
app.rdb = rdb;

//Passport
app.use(passport.initialize());
require('./config/passport')(passport);

//Swagger
var swaggerDefinition = {
  info: {
    title: 'Allmatech API',
    version: '1.0.0',
    description: 'Documentação da Allmatech',
  },
  basePath: '/',
};

//Opcoes do swagger docs

var options = {
  // setando a definition
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['./routes/*.js'],
};

var swaggerSpec = swaggerJSDoc(options);

//Mostrar o swagger
app.get('/swagger.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/admin', admin)



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
