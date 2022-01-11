const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/hello", (req, res) => {
    res.send("HELLO FROM NOTES!");
  });

  // Adding new notes
  router.post("/notes/new", async (req, res) => {
    const { user_id } = req.session;
    if (!user_id) {
      return res.status(400).send("You need to be logged in!");
    }

    const { title, topic, url, description } = req.body;
    if (!title || !topic || !url || !description) {
      return res
        .status(400)
        .send(
          "You need to fill title, url, description or topic  fields correctly."
        );
    }

    try {
      await db.query(
        `INSERT INTO urls (title, topic, url, description, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
        [title, topic, url, description, user_id]
      );
      return res.redirect("/");
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  });

  router.post("/:id/edit", (req, res) => {
    if (!req.session.user_id) {
      res.redirect("/register");
      return;
    }
    // this part has problem, need ask mentor
    console.log(req.body);
    db.query(
      `INSERT INTO URLs (title, url, description) VALUES ($1, $2, $3) RETURNING *`
    );
  });

  router.post("/:id/delete", (req, res) => {
    if (!req.session.user_id) {
      res.redirect("/register");
      return;
    }
    // this part has problem, need ask mentor
    console.log(req.body);
    db.query(
      `INSERT INTO URLs (title, url, description) VALUES ($1, $2, $3) RETURNING *`
    );
  });

  return router;
};
