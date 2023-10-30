// logging and handling HTTP errors like 404=not found, 200=OK,.
var createError = require("http-errors");
var express = require("express");
var path = require("path");
const cors=require('cors');

var cookieParser = require("cookie-parser");

const auth = require("./routes/api/auth")

const products = require("./routes/api/products")

//error logging - level = warning, info etc
var logger = require("morgan");

// <% if(a>b){} %> for using JS code inside EJS file.
var expressLayouts = require("express-ejs-layouts");

// indexRouter contain registration & login functions
var indexRouter = require("./routes/index");

// routes which can only be accessed by a LOGGED IN User.
var protectedRouter = require("./routes/protected");
var sessionAuth = require("./middlewares/sessionAuth");
var checkSessionAuth = require("./middlewares/checkSessionAuth");
var apiauth = require("./middlewares/apiauth");

var shop = require("./routes/shop")

// Creating a new session with a user when he logs in. 
//There will be choices if you wish to generate a session even if noting was altered etc
var session = require("express-session");

// otherwise using req.session.user will consider user a prop pf session but session not an obj nor a var.
var app = express();

// to convert data to JSON
var bodyParser = require("body-parser");
app.use(bodyParser.json());

// cors used to make requests over different domains and ports
app.use(cors());


// for parsing application/xwww-
// also we can't submit form without using "urlencoded" command.
app.use(bodyParser.urlencoded({ extended: true }));

// port, mongodb server link and session secrets are in this development.json file
var config = require("config");
app.use(
  session({
    secret: config.get("sessionSecret"),
    cookie: { maxAge: 60000 }, // user will auto-logout in this time
    resave: true,
    saveUninitialized: true,
  })
);
// const { startCronJobs } = require("./croneJobs/index");
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);

// logs errors - of different levels like warning, critical, info, alert.
app.use(logger("dev"));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/public/products", require("./routes/api/public/products"));
app.use("/api/novels", require("./routes/api/products"))

// apiauth needs token, can't add products without it. 
// app.use("/api/products", apiauth, products);
app.use("/api/products", products);

//app.use("/api/products", require("./routes/api/products"));

app.use("/api/auth", require("./routes/api/auth"));

//app.use("/", sessionAuth, indexRouter);

app.use("/", sessionAuth, indexRouter);
app.use("/my-account", sessionAuth, checkSessionAuth, protectedRouter);

//app.use("/", sessionAuth, shop);
app.use("/", shop);

//app.use("/", sessionAuth, auth)

app.get("/admin", async (req, res) => {
  res.sendFile(path.join(__dirname, "admin", "build", "index.html"));
});
app.get("/admin/*", async (req, res) => {
  res.sendFile(path.join(__dirname, "admin", "build", "index.html"));
});
app.use(express.static(path.join(__dirname, "admin", "build")));

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

//startCronJobs();
// mongoose connection is in inside "./bin/www.js"
// port and connection link of mongoose is inside "./config/development.json"

module.exports = app;
