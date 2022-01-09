const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');



const loginCheck = function(email, password) {
  return db.query(`SELECT * FROM users WHERE email = $1;` , [email])
  .then(res => {
    if(res.rows) {
      return res.rows[0];
    }
    return null;
  })
  .then(user => {
    if(bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  })
};

exports.loginCheck = loginCheck;


module.exports = (db) => {
  router.get("/login", (req, res) => {
      if (req.session.user_id) res.redirect("/notes");
      else {
        const templateVars = {
          user: users[req.session.user_id],
          user_id: req.session.user_id,
        };
        res.render("login", templateVars);
      }
    });

  router.post("/", (req, res) => {
    const {email, password } = req.body;
    loginCheck(email, password)
    .then(user => {
      if (!user) {
        res.redirect("/home")
        return;
      }
      req.session.user_id = user.id;
      // templateVars??
      res.redirect("/notes");
    })
    .catch(err => res.send("error", err.message))
  })

  return router;
};
