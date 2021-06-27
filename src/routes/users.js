const express = require("express");
const router = express.Router();

const UserController = require("../app/controllers/UsersController");

router.post("/register", UserController.register);

router.post("/login", UserController.login);

router.get("/logout", UserController.logout);

router.get("/refresh_token", UserController.refreshToken);

module.exports = router;
