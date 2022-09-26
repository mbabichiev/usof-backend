const express = require("express");
const userController = require("../controllers/userController.js");
const userRouter = express.Router();

userRouter.patch("/avatar", userController.uploadAvatar)
userRouter.get("/:id", userController.getUserById)
userRouter.patch("/:id", userController.updateUser)
userRouter.delete("/:id", userController.deleteUser)
userRouter.get("/", userController.getUsers);
userRouter.post("/", userController.createUser);
 
module.exports = userRouter;