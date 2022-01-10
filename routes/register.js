const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

//register page
module.exports = (db) => {
  router.get("/", (req, res) => {
    if (req.session.user_id) {
      res.redirect("/notes");
      return;
    }
    const templateVars = {
      user_id: null,
    };
    res.render("register", templateVars);
  });

  router.post("/", (req, res) => {
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
  return router;
};
