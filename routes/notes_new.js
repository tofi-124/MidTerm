const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    if (!req.session.user_id) {
      res.redirect("/home");
      return;
    }
    const templateVars = {
      user_id: req.session.user_id,
    };
    res.render("notes_new", templateVars);
  });

  