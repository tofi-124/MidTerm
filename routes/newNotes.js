const express = require('express');
const router  = express.Router();
const bcrypt = require("bcrypt");

module.exports = (db) => {
  router.get("/", (req, res) => {
    if (!req.session.user_id) {
      res.redirect("/home")
      return;
    }
    const templateVars = {
      user_id: req.session.user_id
    };
    res.render("notes_new", templateVars);
  })

  router.post("/", (req, res) => {
    if (!req.session.user_id) {
      res.redirect("/register")
      return;
  }
  // this part has problem, need ask mentor
    console.log(req.body)
    db.query(`INSERT INTO URLs (title, url, description) VALUES ($1, $2, $3) RETURNING *`, [] )

    const templateVars = {
      user_id: req.session.user_id
    };
    res.redirect("/notes");
  })
  return router;
};



