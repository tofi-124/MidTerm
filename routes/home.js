const express = require('express');
const router  = express.Router();


module.exports = () => {

  router.get("/home", (req, res) => {
    if (req.session.user_id) {
      res.redirect("/notes");
    } else {
      const templateVars = {
        user: users[req.session.user_id],
        user_id: req.session.user_id,
      };
      res.render("landingpage", templateVars);
    }
  })
  return router;
};


