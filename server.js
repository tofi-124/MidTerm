// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect(() => {
  console.log('connected to database')
});

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

//-----------------------------------------------------------------//
//---------------------------->>> NPMS <<<-------------------------//
//-----------------------------------------------------------------//

// Setting up cookie session
// http://expressjs.com/en/resources/middleware/cookie-session.html
let cookieSession = require("cookie-session");
app.use(
  cookieSession({
    name: "session",
    keys: ["key"],
  })
);

// Body parser
// https://www.npmjs.com/package/body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// Bcrypt
// https://www.npmjs.com/package/bcrypt
const bcrypt = require("bcryptjs");

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
// const usersRoutes = require("./routes/users");
// const widgetsRoutes = require("./routes/widgets");

const homePage = require("./routes/home")
const registerPage = require("./routes/register");
const loginPage = require("./routes/login");
const logoutPage = require("./routes/logout");
const notes_new = require("./routes/notes_new");
const notes = require("./routes/notes");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// app.use("/api/users", usersRoutes(db));
// app.use("/api/widgets", widgetsRoutes(db));
// Note: mount other resources here, using the same pattern above
app.use("/home", homePage());
app.use("/register", registerPage(db));
app.use("/login", loginPage(db));
app.use("/logout", logoutPage());
app.use("/notes", notes(db));
app.use("/notes/new", notes_new(db));

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/index", (req, res) => {
  res.render("index");
});

//Start initialization
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// home
app.get("/", (req, res) => res.redirect("/home"));

