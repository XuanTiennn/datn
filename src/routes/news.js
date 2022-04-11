const express = require("express");
const router = express.Router();
const NewsController = require("../app/controllers/NewsController");
const auth = require("../middlewares/auth");
const authAdmin = require("../middlewares/authAdmin");

router
  .route("/news")
  .get(NewsController.getNews)
  .post(auth, authAdmin, NewsController.createNew);

router
  .route("/news/:id")
  .delete(auth, authAdmin, NewsController.deleteNew)
  .put(auth, authAdmin, NewsController.editNew)
  .get(NewsController.getItem); 

module.exports = router;
