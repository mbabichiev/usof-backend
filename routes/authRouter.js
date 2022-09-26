const express = require("express");
const authController = require("../controllers/authController.js");
const authRouter = express.Router();

authRouter.post("/register", authController.create);
authRouter.post("/login", authController.checkLoginAndPassword);
authRouter.post("/logout", authController.logout);
authRouter.post("/password-reset/:token", authController.passwordResetWithToken);
authRouter.post("/password-reset", authController.resetPasswordAndSendToEmail);
 
module.exports = authRouter;