const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/hello", (req, res) => {
    res.send("HELLO FROM NOTES!");
  })

  router.post("/", (req, res) => {
    if (!req.session.user_id) {
      res.redirect("/register")
      return;
  }
  // this part has problem, need ask mentor
    console.log(req.body)
    db.query(`INSERT INTO URLs (title, url, description) VALUES ($1, $2, $3) RETURNING *`)
  })

  router.post("/:id/edit", (req, res) => {
    if (!req.session.user_id) {
      res.redirect("/register")
      return;
  }
  // this part has problem, need ask mentor
    console.log(req.body)
    db.query(`INSERT INTO URLs (title, url, description) VALUES ($1, $2, $3) RETURNING *`)
  })

  router.post("/:id/delete", (req, res) => {
    if (!req.session.user_id) {
      res.redirect("/register")
      return;
  }
  // this part has problem, need ask mentor
    console.log(req.body)
    db.query(`INSERT INTO URLs (title, url, description) VALUES ($1, $2, $3) RETURNING *`)
  })

  return router;
};


