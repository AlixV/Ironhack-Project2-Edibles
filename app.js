require('dotenv').config();
require("./config/mongodb")

// base dependencies
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const flash = require("connect-flash");
const session = require("express-session");
const hbs = require("hbs");
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, '/views/partials'))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// config
app.use(
	session({
		secret:
			process.env.SESSION_SECRET || "ASecretStringThatSouldBeHARDTOGUESS/CRACK",
		saveUninitialized: true,
		resave: true,
	})
);

app.use(flash());

// CUSTOM MIDDELWARES

app.use(require("./middlewares/exposeLoginStatus")); // expose le status de connexion aux templates
app.use(require("./middlewares/exposeFlashMessage")); // affiche les messages dans le template


// all routers
// - index routes
const indexRouter = require("./routes/index");
app.use("/", indexRouter);
// - user routes
// const usersRouter = require('./routes/users');
// app.use('/users', usersRouter);

// - recipe routes
const recipesRouter = require("./routes/recipes");
app.use("/recipes", recipesRouter);

// - auth routes
const authRouter = require('./routes/auth');
app.use('/', authRouter);

// - dashboard routes
// const playerRouter = require('./routes/player');
// app.use('/player', playerRouter);

// - game routes
const gameRouter = require('./routes/game');
app.use('/game', gameRouter);

// - plant routes
const plantRouter = require('./routes/plant');
app.use('/plant', plantRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});



module.exports = app;
