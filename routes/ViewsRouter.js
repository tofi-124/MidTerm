const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/hello", (req, res) => {
    res.send("HELLO FROM VIEWS!");
  })

  //-------------------VIEW HOMEPAGE ----------------------//
  router.get("/", (req, res) => {
    const { user_id } = req.session;
    if (user_id) {
      return res.redirect("/notes");
    }
    const templateVars = {
      user: null
    };
    return res.render("index", templateVars)
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
    return res.render("register", templateVars)
  });

  router.get("/login", (req, res) => {
    const { user_id } = req.session;
    if (user_id) {
      return res.redirect("/notes");
    }
    const templateVars = {
      user: null
    };
    return res.render("login", templateVars)
  });

  //-------------------VIEW NOTES ROUTES ----------------------//

  router.get("/notes", async (req, res) => {
    const { user_id } = req.session; // checking cookies
    if (!user_id) {
      return res.redirect("/");
    }

    try {
      const validUser = await db.query(`SELECT * FROM users WHERE id = $1;`, [user_id]) //checking id from the db
      if (!validUser) {
        return res.redirect("/");
      }

      const resources = await db.query(`SELECT * FROM URLs;`);
      const templateVars = {
        user: validUser.rows[0],
        notes: resources.rows
      }
      return res.render("notes_index", templateVars);
    } catch (error) {
      return res.status(400).send({message: error.message});
    }
  });

  router.get("/notes/new", async (req, res) => {
    const { user_id } = req.session; // checking cookies
    if (!user_id) {
      return res.redirect("/");
    }

    try {
      const validUser = await db.query(`SELECT * FROM users WHERE id = $1;`, [user_id]) //checking id from the db
      if (!validUser) {
        return res.redirect("/");
      }

      const templateVars = {
        user: validUser.rows[0]
      }
      return res.render("notes_new", templateVars);
    } catch (error) {
      return res.status(400).send({message: error.message});
    }
  })

  router.get("/notes/myresources", async (req, res) => {
    const { user_id } = req.session; // checking cookies
    if (!user_id) {
      return res.redirect("/");
    }

    try {
      const validUser = await db.query(`SELECT * FROM users WHERE id = $1;`, [user_id]) //checking id from the db
      if (!validUser) {
        return res.redirect("/");
      }

      const resources = await db.query(`SELECT * FROM URLs WHERE user_id = $1;`, [validUser.rows[0].id]);
      const templateVars = {
        user: validUser.rows[0],
        notes: resources.rows
      }
      return res.render("notes_myresources", templateVars);
    } catch (error) {
      return res.status(400).send({message: error.message});
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
      const urlObject = await db.query (`SELECT * FROM URLs WHERE id = $1;`, [urlID]);

      if (urlObject.rows[0].user_id !== validUser.rows[0].id) {
        return res.status(401).send("You are not allowed to edit this note!");
      }

      const templateVars = {
        user: validUser.rows[0],
        note: urlObject.rows[0]
      }
      return res.render("notes_edit", templateVars);
    } catch (error) {
      return res.status(400).send({message: error.message});
    }
  })

  router.get("/notes/likes", async (req, res) => {
    const { user_id } = req.session; // checking cookies
    if (!user_id) {
      return res.redirect("/");
    }

    try {
      const validUser = await db.query(`SELECT * FROM users WHERE id = $1;`, [user_id]) //checking id from the db
      if (!validUser) {
        return res.redirect("/");
      }

      const resources = await db.query(`SELECT * FROM URLs JOIN urls_users ON URLs.id = urls_users.url_id WHERE urls_users.user_id = $1;`, [validUser.rows[0].id]);
      const templateVars = {
        user: validUser.rows[0],
        notes: resources.rows
      }
      return res.render("notes_likes", templateVars);
    } catch (error) {
      return res.status(400).send({message: error.message});
    }

  });

  //---------------------------- DELETE LIKED NOTE -------------------------//

  // router.post("/notes/likes", async (req, res) => {
  //   const { user_id } = req.session; // checking cookies
  //   if (!user_id) {
  //     return res.redirect("/");
  //   }

  //   try {
  //     const validUser = await db.query(`SELECT * FROM users WHERE id = $1;`, [user_id]) //checking id from the db
  //     if (!validUser) {
  //       return res.redirect("/");
  //     }

  //     const resources = await db.query(`DELETE * FROM urls_liked JOIN URLs ON URLs.id = url_id`);
  //     // const templateVars = {
  //     //   user: validUser.rows[0],
  //     //   notes: resources.rows
  //     // }
  //     return res.render("notes_likes", templateVars);
  //   } catch (error) {
  //     return res.status(400).send({message: error.message});
  //   }

  // });

  return router;
};



//-----------Query to search by the topic-------------//
//db.query(
  //     `SELECT title, url, description, rating, comment
  //   FROM URLs JOIN url_ratings ON URLs.id = url_id
  //   WHERE topic = $1;`, [topic]
  //   )
