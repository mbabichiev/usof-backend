const express = require("express");
const commentController = require("../controllers/commentController.js")
const commentRouter = express.Router();

commentRouter.get("/:id", commentController.getCommentById)
commentRouter.patch("/:id", commentController.updateCommentById)
commentRouter.delete("/:id", commentController.deleteCommentById)
commentRouter.get("/:id/like", commentController.getAllLikesByCommentId)
commentRouter.post("/:id/checklike", commentController.checkForLikeByCommentId)
commentRouter.post("/:id/like", commentController.createLikeByCommentId)
commentRouter.delete("/:id/like", commentController.deleteLikeByCommentId)
 
module.exports = commentRouter;