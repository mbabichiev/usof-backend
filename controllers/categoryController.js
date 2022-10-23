const CategoryService = require("../services/categoryService.js");
const PostService = require("../services/postService.js");
const Category = require("../models/category.js");
const PostMapper = require("../utils/PostMapper");

let categoryService = new CategoryService();
let postService = new PostService();

let postMapper = new PostMapper();

exports.getAllCategories = async function (request, response){ 

    let data = await categoryService.getAllCategories();

    let categories = [];

    for(var i = 0; data[i]; i++) {
        categories.push({
            id: data[i].id,
            title: data[i].title,
            description: data[i].description
        })
    }

    response.status(200).send({
        categories: categories
    })

}


exports.getCategoryById = async function (request, response) {

    let id = request.params.id;

    if(!id.match(/^\d+$/)) {
        return response.status(400).send();
    }

    let category = await categoryService.getCategoryById(id);

    if(category == -1) {
        response.status(400).send("Category not found");
    }
    else {
        response.status(200).send({
            category: {
                id: category.id,
                title: category.title,
                description: category.description
            }
        })
    }

}


exports.getAllPostsByCategoryId = async function (request, response) {

    let id = String(request.params.id);

    if(!id.match(/^\d+$/)) {
        return response.status(400).send();
    }

    let data = await postService.getAllPosts(); //get all posts

    let posts = []

    // find posts with category id
    for(var i = 0; data[i]; i++) {

        let categories = String(data[i].categories).split(",");

        if(categories.indexOf(id) != -1) {
            posts.push(await postMapper.getPostJSON(data[i]))
        }
    }

    response.status(200).send({
        posts: posts
    })
}



exports.createCategory = async function (request, response) {

    let status = await categoryService.createCategory(new Category(
        request.body.title,
        request.body.description
    ));


    if(status == 0) {
        response.status(201).send();
    }
    else if(status == -1) {
        response.status(400).send("Category has null data");
    }
    else if(status == -2) {
        response.status(400).send("Category is already exist");
    }
    else {
        response.status(500).send();
    }

} 


exports.updateCategoryById = async function (request, response) {

    let id = request.params.id;

    if(!id.match(/^\d+$/)) {
        return response.status(400).send();
    }

    let status = await categoryService.updateCategoryById(id, new Category(
        request.body.title,
        request.body.description
    ));


    if(status == 0) {
        response.status(202).send();
    }
    else if(status == -1) {
        response.status(400).send("Category not found");
    }
    else {
        response.status(500).send();
    }

}


exports.deleteCategoryById = async function (request, response) {

    let id = request.params.id;

    if(!id.match(/^\d+$/)) {
        return response.status(400).send();
    }

    let status = await categoryService.deleteCategoryById(id);

    if(status == 0) {
        response.status(204).send();
    }
    else if(status == -1) {
        response.status(400).send("Category not found");
    }
    else {
        response.status(500).send();
    }

}


