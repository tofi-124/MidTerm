const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');


//register page
module.exports = (db) => {

  router.get("/register", (req, res) => {
    if (req.session.user_id) res.redirect("/notes");
    else {
      const templateVars = {
        user: users[req.session.user_id],
        user_id: req.session.user_id,
      };
      res.render("register", templateVars);
    }
  });

  router.post("/", (req, res) => {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 10);

    db.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;`
      , [user.name, user.email, user.password])
      .then(res => res.rows[0])
      .then(user => {
        if(!user) {
          res.send({error: "error"});
          return;
        }
        req.session.user_id = user.id;
        const templateVars = {
          user: users[req.session.user_id], //??
          user_id: req.session.user_id,
        };

        res.redirect("/notes");
      })
      .catch(err => {
        res
          .status(500)
          .send("error", err.message);
      });
    });
  return router;
};


