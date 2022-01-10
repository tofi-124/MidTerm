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

  router.post("/", (req, res) => {
    const urls = req.body;
  
    db.query(
      `INSERT INTO urls (title, topic, url, description) VALUES ($1, $2, $3, $4) RETURNING *;`,
      [urls.title, urls.topic, urls.url, urls.description]
    )
      .then((res) => res.rows[0])
      .then((urls) => {
        if (!urls) {
          res.send({ error: "Please enter title, topic, url and description" });
          return;
        }
        res.redirect("/notes");
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};




