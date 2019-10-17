const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const helpers = require("handlebars-helpers")();
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const mongoose = require("mongoose");
const osmosis = require("osmosis");

const app = express();

//Load Models
Coin = require("./models/coin");
Denomination = require("./models/denomination");
Category = require("./models/category");

//Load Routes
const index = require("./routes/index");
// const admintools = require("./routes/admintools");
const api = require("./routes/api");
const catalog = require("./routes/catalog");
const collection = require("./routes/collection");
const user = require("./routes/user");
const storage = require("./routes/storage");

//Passport config
require("./config/passport")(passport);

//Load Keys
const keys = require("./config/keys");

//Connect to mongoose
mongoose
  .connect(keys.mongoURI, {
    useMongoClient: true
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => console.log(err));

// Handlebars Middleware
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Express session midleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// Static folder
app.use(express.static(path.join(__dirname, "public")));

//Use Routes
app.use("/", index);
// app.use("/admintools", admintools);
app.use("/api", api);
app.use("/catalog", catalog);
app.use("/collection", collection);
app.use("/user", user);
app.use("/storage", storage);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
