const express = require('express');
const router  = express.Router();


module.exports = () => {

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
  return router;
};


