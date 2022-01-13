const express = require("express");
const router = express.Router();
module.exports = (db) => {
  router.get("/hello", (req, res) => {
    res.send("HELLO FROM NOTES!");
  });
  //----------------------------- ADD NEW NOTES -------------------------//
  router.post("/", async (req, res) => {
    const { user_id } = req.session;
    if (!user_id) {
      return res.status(400).send("You need to be logged in!");
    }
    try {
      const validUser = await db.query(`SELECT * FROM users WHERE id = $1;`, [
        user_id,
      ]); //checking id from the db
      if (!validUser) {
        return res.redirect("/");
      }
      const { title, topic, url, description } = req.body;
      if (!title || !topic || !url || !description) {
        return res
          .status(400)
          .send(
            "You need to fill title, url, description or topic  fields correctly."
          );
      }
      await db.query(
        `INSERT INTO urls (title, topic, url, description, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
        [title, topic, url, description, user_id]
      );
      return res.redirect("/");
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  });
  //-------------------------------ADD LIKED NOTES --------------------------//
  router.post("/:urlID/like", async (req, res) => {
    const { user_id } = req.session;
    if (!user_id) {
      return res.status(400).send("You need to be logged in!");
    }
    try {
      const validUser = await db.query(`SELECT * FROM users WHERE id = $1;`, [user_id]); //checking id from the db
      if (!validUser) {
        return res.redirect("/");
      }
      const { urlID } = req.params;
      const urlExists = await db.query(
        `SELECT * FROM urls_users WHERE url_id = $1 AND user_id = $2;`, [urlID, validUser.rows[0].id]); //checking url from the db
      if (urlExists.rows[0]) {
        return res
          .status(400)
          .send("The url is already in your liked resources!");
      }
      await db.query(
        `INSERT INTO urls_users (user_id, url_id)
      VALUES ($1, $2) RETURNING *;`,
        [validUser.rows[0].id, urlID]
      );
      return res.redirect("/notes/likes");
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  });
  //-------------------------------EDIT NOTES --------------------------//
  router.post("/:urlID/edit", async (req, res) => {
    const { user_id } = req.session;
    if (!user_id) {
      return res.status(400).send("You need to be logged in!");
    }
    try {
      const validUser = await db.query(`SELECT * FROM users WHERE id = $1;`, [
        user_id,
      ]); //checking id from the db
      if (!validUser) {
        return res.redirect("/");
      }
      const { urlID } = req.params;
      const urlObject = await db.query(`SELECT * FROM URLs WHERE id = $1;`, [
        urlID,
      ]); //checking id from the db
      if (!urlObject) {
        return res.status(404).send({ message: "URL is not found" });
      }
      const urlBelongsToUser =
        urlObject.rows[0].user_id === validUser.rows[0].id;
      if (!urlBelongsToUser) {
        return res.status(404).send({ message: "You cannot change this URL" });
      }
      const { title, topic, url, description } = req.body;
      if (!title || !topic || !url || !description) {
        return res
          .status(400)
          .send(
            "You need to fill title, url, description or topic  fields correctly."
          );
      }
      await db.query(
        `UPDATE urls SET title = $1, topic = $2, url = $3, description = $4 WHERE id = $5 RETURNING *;`,
        [title, topic, url, description, urlID]
      );
      return res.redirect("/notes/myresources");
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  });
  //-------------------------------DELETE NOTES --------------------------//
  router.post("/:urlID/delete", async (req, res) => {
    const { user_id } = req.session;
    if (!user_id) {
      return res.status(400).send("You need to be logged in!");
    }
    try {
      const validUser = await db.query(`SELECT * FROM users WHERE id = $1;`, [
        user_id,
      ]); //checking id from the db
      if (!validUser) {
        return res.redirect("/");
      }
      const { urlID } = req.params;
      const urlObject = await db.query(`SELECT * FROM URLs WHERE id = $1;`, [
        urlID,
      ]); //checking id from the db
      if (!urlObject) {
        return res.status(404).send({ message: "URL is not found" });
      }
      const urlBelongsToUser =
        urlObject.rows[0].user_id === validUser.rows[0].id;
      if (!urlBelongsToUser) {
        return res.status(404).send({ message: "You cannot delete this URL" });
      }
      await db.query(`DELETE FROM URLs WHERE id = $1;`, [urlID]);
      return res.redirect("/notes/myresources");
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  });
  //-------------------------------FILTER NOTES --------------------------//
  router.post("/topic", async (req, res) => {
    const { user_id } = req.session; // checking cookies
    if (!user_id) {
      return res.redirect("/");
    }
    try {
      const validUser = await db.query(`SELECT * FROM users WHERE id = $1;`, [
        user_id,
      ]); //checking id from the db
      if (!validUser) {
        return res.redirect("/");
      }
      const { topic } = req.body;
      const resources = await db.query(`SELECT * FROM URLs WHERE topic = $1;`, [
        topic,
      ]);
      const templateVars = {
        user: validUser.rows[0],
        notes: resources.rows,
      };
      return res.render("topic", templateVars);
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  });
  //-------------------------------REMOVE LIKED NOTES --------------------------//
  router.post("/:urlID/remove", async (req, res) => {
    const { user_id } = req.session;
    if (!user_id) {
      return res.status(400).send("You need to be logged in!");
    }
    try {
      const validUser = await db.query(`SELECT * FROM users WHERE id = $1;`, [user_id]); //checking id from the db
      if (!validUser) {
        return res.redirect("/");
      }
      const { urlID } = req.params;
      const urlObject = await db.query(`SELECT * FROM URLs WHERE id = $1;`, [urlID]); //checking id from the db
      if (!urlObject) {
        return res.status(404).send({ message: "URL is not found" });
      }

      await db.query(`DELETE FROM urls_users WHERE url_id = $1 AND user_id = $2;`, [urlID, validUser.rows[0].id]);
      return res.redirect("/notes/likes");
    } catch (error) {
       return res.status(400).send({ message: error.message });
     }
   });

   //------------------------------- Comment/Rate --------------------------//
   router.post("/:urlID/comment_rate", async (req, res) => {
     const { user_id } = req.session;
     if (!user_id) {
       return res.status(400).send("You need to be logged in!");
     }

     try {
       const validUser = await db.query(`SELECT * FROM users WHERE id = $1;`, [user_id]); //checking id from the db
       if (!validUser) {
         return res.redirect("/");
       }

       const { urlID } = req.params;
       const { comment, rate } = req.body;

       await db.query(
         `INSERT INTO url_ratings (rating,comment,user_id, url_id)
       VALUES ($1, $2, $3, $4) RETURNING *;`,
         [rate, comment, validUser.rows[0].id, urlID]
       );

       return res.redirect("/");
     } catch (error) {
       return res.status(400).send({ message: error.message });
     }
   });

   return router;
 };
