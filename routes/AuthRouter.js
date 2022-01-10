const express = require("express");
const bcrypt = require("bcryptjs");
const { loginCheck } = require("../helpers");
const router = express.Router();

//register page
module.exports = (db) => {
  router.get("/hello", (req, res) => {
    res.send("HELLO FROM AUTH!");
  })

  router.post("/register", (req, res) => {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 10);

    db.query(
      `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;`,
      [user.username, user.email, user.password]
    )
      .then((res) => res.rows[0])
      .then((user) => {
        if (!user) {
          res.send({ error: "Please enter username, email and password" });
          return;
        }
        res.redirect("/login");
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/login", (req, res) => {
    const { email, password } = req.body;
    loginCheck(email, password, db)
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

  router.post('/logout', (req, res) => {
    req.session = null;
    res.redirect("/");
  })

  return router;
};
