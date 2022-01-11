const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

//register page
module.exports = (db) => {
  router.get("/hello", (req, res) => {
    res.send("HELLO FROM AUTH!");
  });

  router.post("/register", async (req, res) => {
    const { user_id } = req.session; // checking cookies
    if (user_id) {
      return res.status(400).send("You are already logged in!");
    }

    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .send("You need to fill username, email or password fields correctly.");
    }

    try {
      const emailExists = await db.query(
        `SELECT * FROM users WHERE email = $1;`,
        [email]
      ); //checking email from the db
      if (emailExists.rows[0]) {
        return res.status(400).send("The email is already registered!");
      }

      const hashedPassword = bcrypt.hashSync(password, 10);
      await db.query(
        `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;`,
        [username, email, hashedPassword]
      );
      return res.redirect("/login");
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  });

  router.post("/login", async (req, res) => {
    const { user_id } = req.session; // checking cookies
    if (user_id) {
      return res.status(400).send("You are already logged in!");
    }

    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .send("You need to fill email or password fields correctly.");
    }

    try {
      const validUser = await db.query(
        `SELECT * FROM users WHERE email = $1;`,
        [email]
      ); //checking email from the db
      if (!validUser.rows[0]) {
        return res
          .status(400)
          .send("This user does not exist! You have to register!");
      }

      const passwordMatch = bcrypt.compareSync(
        password,
        validUser.rows[0].password
      ); //checking the existing password with the inserted
      if (!passwordMatch) {
        return res.status(400).send("Incorrect password!");
      }

      req.session.user_id = validUser.rows[0].id;
      return res.redirect("/notes");
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  });

  router.post("/logout", (req, res) => {
    req.session = null;
    return res.redirect("/");
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

  return router;
};
