const createError = require('http-errors');
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const db = require('./db');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const dashboardsRouter = require('./routes/dashboard');
const config = require('./config');
const checkAuth = require('./middleware/checkAuth').checkAuth;
//const test = require('./bin/test');
const chat = require('./chat');
const cors = require('cors');

app.use(cors({origin : 'http://localhost:3000'}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
  secret: config.secret,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));
app.use(express.static(path.join(__dirname, 'public')));



app.use('/index', (req, res, next) => {
  res.send(req.query);
});
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(checkAuth);
app.use('/dashboards', dashboardsRouter);
//app.use('/cards', cardsRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.error = req.app.get('env') === 'development' ? err : err;
  // render the error page
  res.status(err.status || 500);

  res.send({message: err.message ? err.message : "error"});
});

module.exports = app;
