const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/hello", (req, res) => {
    res.send("HELLO FROM NOTES!");
  });

  //-------------------------------ADD LIKED NOTES --------------------------//

  router.post("/:urlID/like", async (req, res) => {
    const { user_id } = req.session;
    if (!user_id) {
      return res.status(400).send("You need to be logged in!");
    }

    try {
      const validUser = await db.query(`SELECT * FROM users WHERE id = $1;`, [user_id]) //checking id from the db
      if (!validUser) {
        return res.redirect("/");
      }

      const { urlID } = req.params;

      await db.query(
        `INSERT INTO urls_liked (user_id, url_id)
        VALUES ($1, $2) RETURNING *;`,
        [validUser.rows[0].id, urlID]
      );
      return res.redirect("/");
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  });

  router.post("/:id/edit", (req, res) => {});


  router.post("/:id/delete", (req, res) => {});


  return router;
};
