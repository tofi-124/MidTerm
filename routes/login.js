const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const loginCheck = function (email, password) {
  return db
    .query(`SELECT * FROM users WHERE email = $1;`, [email])
    .then((res) => {
      if (res.rows) {
        return res.rows[0];
      }
      return null;
    })
    .then((user) => {
      if (bcrypt.compareSync(password, user.password)) {
        return user;
      }
      return null;
    });
};

exports.loginCheck = loginCheck;

module.exports = (db) => {
  router.get("/", (req, res) => {
    if (req.session.user_id) {
      res.redirect("/notes");
      return;
    }
    const templateVars = {
      user_id: null
    };
    res.render("login", templateVars);
  });

  router.post("/", (req, res) => {
    const { email, password } = req.body;
    loginCheck(email, password)
      .then((user) => {
        if (!user) {
          res.redirect("/home");
          return;
        }
        req.session.user_id = user.id;

        res.redirect("/notes");
      })
      .catch((err) => res.send("error", err.message));
  });

  return router;
};
