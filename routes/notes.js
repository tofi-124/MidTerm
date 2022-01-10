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

        // need to add resources to the notes_show.ejs
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/", (req, res) => {
    const search = req.body;
    db.query(
      `SELECT title, url, description, rating, comment
    FROM URLs JOIN url_ratings ON URLs.id = url_id
    WHERE topic = $1;`, [search]
    )
      .then((data) => {
        const resources = data.rows;
        res.json({ resources });

        // need to add resources to the notes_show.ejs
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};


