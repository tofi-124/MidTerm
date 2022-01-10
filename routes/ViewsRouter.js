const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");


module.exports = (db) => {
  router.get("/hello", (req, res) => {
    res.send("HELLO FROM VIEWS!");
  })

  //-------------------VIEW HOMEPAGE ----------------------//
  router.get("/", (req, res) => {
    if (req.session.user_id) {
      res.redirect("/notes");
    } else {
      const templateVars = {
        user_id: req.session.user_id
      };
      res.render("landingpage", templateVars);
    }
  })

  //-------------------VIEW AUTHROUTES ----------------------//
  router.get("/register", (req, res) => {
    if (req.session.user_id) {
      res.redirect("/notes");
      return;
    }
    const templateVars = {
      user_id: null,
    };
    res.render("register", templateVars);
  });

  router.get("/login", (req, res) => {
    if (req.session.user_id) {
      res.redirect("/notes");
      return;
    }
    const templateVars = {
      user_id: null
    };
    res.render("login", templateVars);
  });

  //-------------------VIEW NOTES ROUTES ----------------------//

  router.get("/notes", (req, res) => {
    db.query(`SELECT * FROM URLs;`)
      .then((data) => {
        const templateVars = {
          user_id: req.session.user_id,
          resources: data.rows
        };
        res.render("notes_index", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });

      const { topic } = req.query;
      db.query(
        `SELECT title, url, description, rating, comment
      FROM URLs JOIN url_ratings ON URLs.id = url_id
      WHERE topic = $1;`, [topic]
      )
        .then((data) => {
        const templateVars = {
          user_id: req.session.user_id,
          resources: data.rows
        };
        res.render("notes_index", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get("/notes/new", (req, res) => {
    if (!req.session.user_id) {
      res.redirect("/")
      return;
    }
    const templateVars = {
      user_id: req.session.user_id
    };
    res.render("notes_new", templateVars);
  })

  router.get("/notes/:id", (req, res) => {
    if (!req.session.user_id) {
      res.redirect("/")
      return;
    }
    const templateVars = {
      user_id: req.session.user_id
    };
    res.render("notes_show", templateVars);
  })

  return router;
};
