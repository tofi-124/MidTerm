const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    if (!req.session.user_id) {
      res.redirect("/register")
      return;
    }
    const templateVars = {
      user: users[req.session.user_id],
      user_id: req.session.user_id,
    };
    res.render("notes_new", templateVars);
  })

  router.post("/", (req, res) => {
    if (!req.session.user_id) res.redirect("/register");

    const templateVars = {
      user: users[req.session.user_id],
      user_id: req.session.user_id,
    };
    res.render("notes_new", templateVars);
  })
  return router;
};



