const express = require("express");
const userController = require("../controllers/userController.js");
const userRouter = express.Router();

userRouter.get("/default", userController.getDefaultAvatar)
userRouter.get("/search/:data", userController.getUsersBySearch);
userRouter.patch("/:id/avatar", userController.uploadAvatar)
userRouter.get("/:id/posts", userController.getAllPostsByUserId)
userRouter.get("/:id", userController.getUserById)
userRouter.get("/:id/avatar", userController.getUserAvatarById)
userRouter.delete("/:id/avatar", userController.deleteAvatarById)
userRouter.patch("/:id", userController.updateUser)
userRouter.delete("/:id", userController.deleteUser)
userRouter.get("/", userController.getUsers);
userRouter.post("/", userController.createUser);
 
module.exports = userRouter;