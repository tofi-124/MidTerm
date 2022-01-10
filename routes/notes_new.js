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

  console.log(req.body);
  // router.post("/", (req, res) => {
  //   const urls = req.body;
  //   let user_id = req.session.user_id;
  
  //   db.query(
  //     `INSERT INTO urls (title, topic, url, description, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
  //     [urls.title, urls.topic, urls.url, urls.description, user_id]
  //   )
  //     .then((res) => res.rows[0])
  //     .then((urls) => {
  //       if (!urls) {
  //         res.send({ error: "Please enter title, topic, url and description" });
  //         return;
  //       }
  //       res.redirect("/notes");
  //     })
  //     .catch(err => {
  //       res
  //         .status(500)
  //         .json({ error: err.message });
  //     });
  // });
  // return router;
};




