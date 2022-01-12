const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/hello", (req, res) => {
    res.send("HELLO FROM VIEWS!");
  });

  //-------------------VIEW HOMEPAGE ----------------------//
  router.get("/", (req, res) => {
    const { user_id } = req.session;
    if (user_id) {
      return res.redirect("/notes");
    }
    const templateVars = {
      user_id: null,
    };
    return res.render("index", templateVars);
  });

  //-------------------VIEW AUTHROUTES ----------------------//
  router.get("/register", (req, res) => {
    const { user_id } = req.session;
    if (user_id) {
      return res.redirect("/notes");
    }
    const templateVars = {
      user_id: null,
    };
    return res.render("register", templateVars);
  });

  router.get("/login", (req, res) => {
    const { user_id } = req.session;
    if (user_id) {
      return res.redirect("/notes");
    }
    const templateVars = {
      user_id: null,
    };
    return res.render("login", templateVars);
  });

  //-------------------VIEW NOTES ROUTES ----------------------//

  router.get("/notes", async (req, res) => {
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

      const resources = await db.query(`SELECT * FROM URLs;`);
      const templateVars = {
        user_id: validUser.rows[0].name,
        notes: resources.rows,
      };
      return res.render("notes_index", templateVars);
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  });

  router.get("/notes/new", async (req, res) => {
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

      const templateVars = {
        user_id: validUser.rows[0].name,
      };
      return res.render("notes_new", templateVars);
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  });

  router.get("/notes/myresources", async (req, res) => {
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

      const resources = await db.query(
        `SELECT * FROM URLs WHERE user_id = $1;`,
        [user_id]
      );
      const templateVars = {
        user_id: validUser.rows[0].name,
        notes: resources.rows,
      };
      return res.render("notes_myresources", templateVars);
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  });

  //------------------- TOPIC ----------------------//

  router.get("/topic", async (req, res) => {
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

      const resources = await db.query(`SELECT * FROM URLs;`);
      const templateVars = {
        user_id: validUser.rows[0].name,
        notes: resources.rows,
      };
      return res.render("topic", templateVars);
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  });

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
        user_id: validUser.rows[0].name,
        notes: resources.rows,
      };
      return res.render("topic", templateVars);
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  });

  //------------------- COMMENT ----------------------//
  router.get("/comment", async (req, res) => {
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

      return res.redirect("/notes");
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  });

  router.post("/comment", async (req, res) => {
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
      console.log(req.body)
      return res.redirect("/notes");
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  });

  //------------------- RATING ----------------------//
  router.get("/rating", async (req, res) => {
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
      return res.redirect("/notes");
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  });

  router.post("/rating", async (req, res) => {
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
      console.log(req.body)
      return res.redirect("/notes");
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  });

  return router;
};
