const express = require("express");
const categoryController = require("../controllers/categoryController.js")
const categoryRouter = express.Router();

categoryRouter.get("/:id/posts", categoryController.getAllPostsByCategoryId)
categoryRouter.get("/:id/", categoryController.getCategoryById)
categoryRouter.patch("/:id/", categoryController.updateCategoryById)
categoryRouter.delete("/:id/", categoryController.deleteCategoryById)
categoryRouter.get("/", categoryController.getAllCategories)
categoryRouter.post("/", categoryController.createCategory)
 
module.exports = categoryRouter;