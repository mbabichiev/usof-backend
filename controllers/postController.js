const PostService = require("../services/postService.js")
const UserService = require("../services/userService.js")
const LikeService = require("../services/likeService.js")
const CategoryService = require("../services/categoryService.js")

const Post = require("../models/post.js");
const Like = require("../models/like.js")

const PostMapper = require("../utils/PostMapper")

let postService = new PostService();
let userService = new UserService();
let likeService = new LikeService();
let categoryService = new CategoryService();
let postMapper = new PostMapper();


exports.createPost = async function (request, response){ 

    if(request.body.author_id && await userService.checkIfUserExistById(request.body.author_id) === false) {
        response.status(400).send("User not found");
        return;
    }

    let post = new Post(
        request.body.author_id, 
        request.body.title,
        Date.now(),
        request.body.status,
        request.body.content,
        request.body.categories
    )

    let status = await postService.createPost(post);

    if(status == 0) {
        response.status(201).send();
    }
    else if(status == -1) {
        response.status(400).send("Post have null data");
    }
    else if(status == -2) {
        response.status(400).send("Post is already exist");
    }
    else if(status == -3) {
        response.status(400).send("Categories not found");
    }
    else {
        response.status(500).send();
    }
}
 
async function getCategoriesJSON(categoriesId, post_id) {

    let categoriesJSON = [];
    let categoriesFilter = [];

    let categories = String(categoriesId).split(',');
    let checkNeedToDelete = false;

    for(var i = 0; i < categories.length; i++) {

        var category = await categoryService.getCategoryById(categories[i]);

        if(category != -1) {
            categoriesJSON.push({
                id: category.id,
                title: category.title,
                description: category.description
            })

            categoriesFilter.push(categories[i])
        }
        else {
            checkNeedToDelete = true;
        }
    }

    if(checkNeedToDelete === true) {

        await postService.updatePostById(post_id, 
            new Post(
                null, 
                null,
                null,
                null,
                null,
                categoriesFilter.join(',')
        ))
    }

    return categoriesJSON;
}


async function getPostsWithLimitAndPage(limit, page) {
    return await postService.getPostsByLimitAndPage(limit, page);
}


exports.getAllPosts = async function (request, response) {

    let data = [];

    if(request.query.limit && request.query.page && request.query.limit > 0 && request.query.page > 0) {
        data = await getPostsWithLimitAndPage(request.query.limit, request.query.page);
    } 
    else {
        data = await postService.getAllPosts();
    }

    let posts = []

    for(var i = 0; data[i]; i++) {
        posts.push(
            await postMapper.getPostJSON(data[i])
        );
    }

    response.status(200).send({
        posts: posts
    })
}


exports.getPostById = async function (request, response) {

    let id = request.params.id;

    let data = await postService.getPostById(id)

    if(data == -1) {
        response.status(400).send("Post not found");
    }
    else {
        response.status(200).send({
            post: await postMapper.getPostJSON(data)
        })
    }
}


exports.updatePostById = async function (request, response) {

    let id = request.params.id;

    let post = new Post(
        null,
        request.body.title,
        null,
        request.body.status,
        request.body.content,
        request.body.categories
    )

    let status = await postService.updatePostById(id, post);

    if(status == 0) {
        response.status(202).send();
    }
    else if(status == -1) {
        response.status(400).send("Post not found");
    }
    else if(status == -3) {
        response.status(400).send("Categories not found");
    }
    else {
        response.status(500).send();
    }

}


exports.deletePostById = async function (request, response) {

    let id = request.params.id;

    let status = await postService.deletePostById(id);

    if(status == 0) {
        response.status(204).send();
    }
    else if(status == -1) {
        response.status(400).send("Post not found");
    }
    else {
        response.status(500).send();
    }

}


exports.getCategoriesByPostId = async function (request, response) {

    let id = request.params.id;

    let data = await postService.getPostById(id)

    if(data == -1) {
        response.status(400).send("Post not found");
    }
    else {
        let categories = String(data.categories).split(",");

        response.status(200).send({
            post: {
                title: data.title,
                categories: await getCategoriesJSON(categories)
            }
        })
    }
}


exports.getLikesByPostId = async function (request, response) { 
    
    let post_id = request.params.id;

    let data = await likeService.getAllLikesByPostId(post_id);

    if(data == -1) {
        response.status(400).send("Post not found");
    }
    else {

        let likes = []

        for(var i = 0; data[i]; i++) {

            var user = await userService.getUserById(data[i].author_id)

            likes.push({
                    author: user.full_name,
                    type: data[i].type
                });
        }

        response.status(200).send({
            likes: likes
        })
    }
}


exports.checkForLikeByPostId = async function (request, response) {

    let post_id = request.params.id;

    if(!request.body.author_id) {
        return response.status(400).send("author_id is null");
    }

    let data = await likeService.getLikeIfExistByPostId(request.body.author_id, post_id);

    response.status(200).send(data);

}


exports.createLikeUnderPost = async function (request, response) { 

    let post_id = request.params.id;

    let like = new Like(
        request.body.author_id,
        post_id,
        "post",
        request.body.type
    )

    let status = await likeService.createLike(like);

    if(status == 0) {
        response.status(201).send();
    }
    else if(status == -1) {
        response.status(400).send("Like has null data");
    }
    else if(status == -2) {
        response.status(400).send("User not found");
    }
    else if(status == -3) {
        response.status(400).send("Post not found");
    }
    else if(status == -4) {
        response.status(400).send("Like is already exist");
    }
    else {
        response.status(500).send();
    }
}


exports.deleteLikeUnderPost = async function (request, response) { 

    let post_id = request.params.id;
    let author_id = request.body.author_id;

    let status = await likeService.deleteLikeById(await likeService.getLikeIdByAuthorIdAndPostId(author_id, post_id));

    if(status == 0) {
        response.status(204).send();
    }
    else if(status == -1) {
        response.status(400).send("User not found");
    }
    else {
        response.status(500).send();
    }

}



