const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(
      `SELECT title, url, description, rating, comment
    FROM URLs JOIN url_ratings ON URLs.id = url_id;`
    )
      .then((data) => {
        const resources = data.rows;
        res.json({ resources });
        // need insert some demo data into the seeds/resources
        // show the resources on page
        // res.render("notes_show", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};


