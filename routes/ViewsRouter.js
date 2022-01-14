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
      user: null
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
      user: null
    };
    return res.render("register", templateVars);
  });

  router.get("/login", (req, res) => {
    const { user_id } = req.session;
    if (user_id) {
      return res.redirect("/notes");
    }
    const templateVars = {
      user: null
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
      const validUser = await db.query(`SELECT * FROM users WHERE id = $1;`, [user_id]); //checking id from the db
      if (!validUser) {
        return res.redirect("/");
      }

      const resources = await db.query(`SELECT * FROM URLs;`);
      const templateVars = {
        user: validUser.rows[0],
        notes: resources.rows
      };
      return res.render("notes_index", templateVars);
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  });

  router.get("/new", async (req, res) => {
    const { user_id } = req.session; // checking cookies
    if (!user_id) {
      return res.redirect("/");
    }

    try {
      const validUser = await db.query(`SELECT * FROM users WHERE id = $1;`, [user_id]); //checking id from the db
      if (!validUser) {
        return res.redirect("/");
      }

      const templateVars = {
        user: validUser.rows[0]
      };

      return res.render("note_new", templateVars);
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  });

  router.get("/myresources", async (req, res) => {
    const { user_id } = req.session; // checking cookies
    if (!user_id) {
      return res.redirect("/");
    }

    try {
      const validUser = await db.query(`SELECT * FROM users WHERE id = $1;`, [user_id]); //checking id from the db
      if (!validUser) {
        return res.redirect("/");
      }

      const resources = await db.query(`SELECT * FROM URLs WHERE user_id = $1;`, [validUser.rows[0].id]);

      const templateVars = {
        user: validUser.rows[0],
        notes: resources.rows
      };
      return res.render("notes_myresources", templateVars);
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  });

  router.get("/notes/:urlID/edit", async (req, res) => {
    const { user_id } = req.session; // checking cookies
    if (!user_id) {
      return res.redirect("/");
    }

    try {

      const validUser = await db.query(`SELECT * FROM users WHERE id = $1;`, [user_id]) //checking id from the db
      if (!validUser) {
        return res.redirect("/");
      }


      const { urlID } = req.params;
      const urlObject = await db.query(`SELECT * FROM URLs WHERE id = $1;`, [urlID]) //checking id from the db
      if (!urlObject) {
        return res.status(404).send({ message: "URL is not found" });
      }

      const urlBelongsToUser = urlObject.rows[0].user_id === validUser.rows[0].id;
      if (!urlBelongsToUser) {
        return res.status(404).send({ message: "You cannot edit this URL" });
      }

      const templateVars = {
        user: validUser.rows[0],
        note: urlObject.rows[0]
      }
      return res.render("note_edit", templateVars);
    } catch (error) {
      return res.status(400).send({message: error.message});
    }
  })

  router.get("/notes/:urlID", async (req, res) => {
    const { user_id } = req.session; // checking cookies
    if (!user_id) {
      return res.redirect("/");
    }
    console.log("USER ID", user_id);



    try {
      const validUser = await db.query(`SELECT * FROM users WHERE id = $1;`, [user_id]); //checking id from the db
      if (!validUser) {
        return res.redirect("/");
      }


      const { urlID } = req.params;
      const urlObject = await db.query(`SELECT * FROM URLs WHERE id = $1;`, [urlID]) //checking id from the db

      if (!urlObject) {
        return res.status(404).send({ message: "URL is not found" });
      }

      const comments = await db.query(`SELECT comment FROM url_ratings WHERE url_id = $1;`, [urlObject.rows[0].id]);
      const rating = await db.query(`SELECT ROUND(AVG(rating), 0) FROM url_ratings WHERE url_id = $1;`, [urlObject.rows[0].id]);

      console.log("HERE:", comments.rows, rating.rows);

      const templateVars = {
        user: validUser.rows[0],
        note: urlObject.rows[0],
        comments: comments.rows,
        rating: rating.rows[0].round
      };

      return res.render("note_details", templateVars);
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  });

  router.get("/mylikes", async (req, res) => {
    console.log("HELLO FROM:/notes/likes")
    const { user_id } = req.session; // checking cookies
    if (!user_id) {
      return res.redirect("/");
    }

    console.log("HERE:", user_id);

    try {
      const validUser = await db.query(`SELECT * FROM users WHERE id = $1;`, [user_id]) //checking id from the db
      if (!validUser) {
        return res.redirect("/");
      }

      console.log("HERE 2:", validUser.rows);

      const resources = await db.query(`SELECT * FROM URLs JOIN urls_users ON URLs.id = urls_users.url_id WHERE urls_users.user_id = $1;`, [validUser.rows[0].id]);

      console.log("HERE 3:", resources.rows);
      const templateVars = {
        user: validUser.rows[0],
        notes: resources.rows
      }
      return res.render("notes_likes", templateVars);
    } catch (error) {
      return res.status(400).send({message: error.message});
    }

  });

  return router;
};

