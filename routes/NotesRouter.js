const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/hello", (req, res) => {
    res.send("HELLO FROM NOTES!");
  });

  router.post("/:id/edit", (req, res) => {});
  router.post("/:id/delete", (req, res) => {});
  
  return router;
};
