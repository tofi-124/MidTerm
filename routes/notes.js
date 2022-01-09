const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/notes", (req, res) => {
    db.query(`SELECT title, url, description, rating, comment
    FROM URLs JOIN url_ratings ON URLs.id = url_id;`)
    .then(data => data.rows)
    .then(resources => {
      const templateVars = {
        user: users[req.session.user_id],
        user_id: req.session.user_id,
      };
      res.render("notes_show", templateVars);
    })
    .catch(err => res.send("error", err.message))
  })
  return router;
};
