//------------------------------------- REQUIREMENTS IN APPLICATION ----------------------------//

require("dotenv").config(); // load .env data into process.env

const express = require("express");
const morgan = require("morgan");
const { Pool } = require("pg");
const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");

const dbParams = require("./lib/db.js");
const sassMiddleware = require("./lib/sass-middleware");
const {
  getUserByEmail,
  passwordFinder,
} = require("./helpers");


// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
// const usersRoutes = require("./routes/users");
// const widgetsRoutes = require("./routes/widgets");

const routes = require('./routes');


//------------------------------------- SERVER SETTINGS AND MIDLWARES IN APPLICATION ----------------------------//

const app = express();

const PORT = process.env.PORT || 8080;

// PG database client/connection setup
const db = new Pool(dbParams);
db.connect(() => {
  console.log('connected to database')
});

app.set("view engine", "ejs");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev")); //just a logger

app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "session",
    keys: ["key"],
  })
);

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

//------------------------------------- ROUTES/ENDPOINTS  ----------------------------//
// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// app.use("/api/users", usersRoutes(db));
// app.use("/api/widgets", widgetsRoutes(db));
// Note: mount other resources here, using the same pattern above
app.use(routes(db));


//------------------------------------- LISTENER  ------------------------------------//
//Start initialization
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});