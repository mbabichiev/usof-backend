const express = require("express");
const postController = require("../controllers/postController.js");
const commentController = require("../controllers/commentController.js");
const postRouter = express.Router();

postRouter.get("/:id/comments", commentController.getAllCommentsByPostId)
postRouter.get("/:id/categories", postController.getCategoriesByPostId)
postRouter.get("/:id/like", postController.getLikesByPostId)
postRouter.get("/:id/photo", postController.getPostPhotoById)
postRouter.post("/:id/checklike", postController.checkForLikeByPostId)
postRouter.post("/:id/like", postController.createLikeUnderPost)
postRouter.patch("/:id/photo", postController.updatePostPhotoByPostId)
postRouter.delete("/:id/photo", postController.deletePostPhotoByPostId)
postRouter.delete("/:id/like", postController.deleteLikeUnderPost)
postRouter.post("/:id/comments", commentController.createCommentWithPostId)
postRouter.delete("/:id", postController.deletePostById)
postRouter.patch("/:id", postController.updatePostById)
postRouter.get("/:id", postController.getPostById)
postRouter.post("/", postController.createPost);
postRouter.get("/", postController.getAllPosts);
 
module.exports = postRouter;