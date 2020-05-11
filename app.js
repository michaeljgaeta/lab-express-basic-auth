"use strict";

const { join } = require("path");
const express = require("express");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const sassMiddleware = require("node-sass-middleware");
const serveFavicon = require("serve-favicon");

const indexRouter = require("./routes/index");
const authenticationRouter = require("./routes/authentication");
const mainRouter = require("./routes/main");
const privateRouter = require("./routes/private");

const deserializeUser = require('./middleware/deserialize-user');
const bindUserDocumentToResponseLocals = require('./middleware/bind-user-to-response-locals');
const routeGuard = require('./middleware/route-guard');

const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

const app = express();

// Setup view engine
app.set("views", join(__dirname, "views"));
app.set("view engine", "hbs");
app.set("models", join(__dirname, "models"));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(serveFavicon(join(__dirname, "public/images", "favicon.ico")));
app.use(express.static(join(__dirname, "public")));
app.use(
  sassMiddleware({
    src: join(__dirname, "public"),
    dest: join(__dirname, "public"),
    outputStyle: process.env.NODE_ENV === "development" ? "nested" : "compressed",
    force: process.env.NODE_ENV === "development",
    sourceMap: true
  })
);

//Session and Mongodb middleware
app.use(
  session({
    secret: "basic-auth-secret",
    cookie: { maxAge: 60000 },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 // 1 day
    })
  })
);

//Middleware to avoid protected routes
app.use(deserializeUser);
app.use(bindUserDocumentToResponseLocals);


//mount routers
app.use("/", indexRouter);
app.use("/authentication", authenticationRouter);
app.use("/main", mainRouter);
app.use("/private", privateRouter);

// Catch missing routes and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Catch all error handler
app.use((error, req, res, next) => {
  // Set error information, with stack only available in development
  res.locals.message = error.message;
  res.locals.error = req.app.get("env") === "development" ? error : {};

  res.status(error.status || 500);
  res.render("error");
});

module.exports = app;
