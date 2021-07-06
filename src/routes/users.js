const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const UserController = require("../app/controllers/UsersController");

router.post("/register", UserController.register);

router.post("/login", UserController.login);

router.get("/logout", UserController.logout);

router.get("/refresh_token", UserController.refreshToken);

router.get("/infor",auth,UserController.getUser);

router.patch("/addcart",auth,UserController.addToCart);

router.get("/history",auth,UserController.history);

module.exports = router;
