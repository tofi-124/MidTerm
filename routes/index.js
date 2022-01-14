const express = require('express');
const router = express.Router();

const ViewsRouter = require('./ViewsRouter');
const AuthRouter = require('./AuthRouter');
const NotesRouter = require('./NotesRouter');

module.exports = (db) => {
  router.use("/", ViewsRouter(db));
  router.use("/api/v1/auth", AuthRouter(db));
  router.use("/api/v1/notes", NotesRouter(db));

  return router;
}

