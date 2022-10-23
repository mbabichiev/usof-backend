const Comment = require("../models/comment.js")
const Like = require("../models/like.js")

const CommentService = require("../services/commentService.js")
const UserService = require("../services/userService.js")
const LikeService = require("../services/likeService.js")

let commentService = new CommentService();
let userService = new UserService();
let likeService = new LikeService();


exports.createCommentWithPostId = async function(request, response) { 

    let post_id = request.params.id;

    let status = await commentService.createComment(new Comment(
        request.body.author_id,
        post_id,
        Date.now(),
        request.body.content
    ))

    if(status == 0) {
        response.status(201).send();
    }
    else if(status == -1) {
        response.status(400).send("Commentory have null data");
    }
    else if(status == -2) {
        response.status(400).send("Post not found");
    }
    else if(status == -3) {
        response.status(400).send("User not found");
    }
    else {
        response.status(500).send();
    }
}


exports.createLikeByCommentId = async function(request, response) { 
    
    let id = request.params.id;

    let status = await likeService.createLike(
        new Like(
            request.body.author_id,
            id, 
            "comment",
            request.body.type
        )
    )


    if(status == 0) {
        response.status(201).send();
    }
    else if(status == -1) {
        response.status(400).send("Commentory have null data");
    }
    else if(status == -2) {
        response.status(400).send("User not found");
    }
    else if(status == -5) {
        response.status(400).send("Comment not found");
    }
    else if(status == -6) {
        response.status(400).send("Like is already exist under the comment");
    }
    else {
        response.status(500).send();
    }
}


exports.checkForLikeByCommentId = async function(request, response) {

    let comment_id = request.params.id;

    if(!request.body.author_id) {
        return response.status(400).send("author_id is null");
    }

    let data = await likeService.getLikeIfExistByCommentId(request.body.author_id, comment_id);

    response.status(200).send(data);
}



exports.getAllCommentsByPostId = async function(request, response) {

    let id = request.params.id;

    let data = await commentService.getAllCommentsByPostId(id);

    if(data == -1) {
        response.status(400).send("Post not found");
        return;
    }
 
    let comments = [];

    for(var i = 0; data[i]; i++) {

        var user = await userService.getUserById(data[i].author_id)

        var likes = await likeService.getNumOfLikesByCommentId(data[i].id)
        var dislikes = await likeService.getNumOfDislikesByCommentId(data[i].id)

        comments.push({
                id: data[i].id,
                author_id: data[i].author_id,
                author: user.full_name,
                publish_date: data[i].publish_date,
                likes: likes.total,
                dislikes: dislikes.total,
                content: data[i].content
            });
    }

    response.status(200).send({
        comments: comments
    })

}


exports.getCommentById = async function(request, response) {

    let id = request.params.id;

    let comment = await commentService.getCommentById(id);

    if(comment == -1) {
        response.status(400).send("Comment not found");
    }
    else {

        var user = await userService.getUserById(comment.author_id)
        // get all likes and dislikes

        response.status(200).send({
            comment: {
                author: user.full_name,
                publish_date: comment.publish_date,
                content: comment.content
            }
        })
    }
}


exports.getAllLikesByCommentId = async function(request, response) {

    let comment_id = request.params.id;

    let data = await likeService.getAllLikesByCommentId(comment_id);

    let likes = []

    for(var i = 0; data[i]; i++) {

        var user = await userService.getUserById(data[i].author_id)

        likes.push({
            id: data[i].id,
            author_id: data[i].author_id,
            author: user.full_name,
            type: data[i].type
        });
    }

    response.status(200).send({
        likes: likes
    })
}


exports.updateCommentById = async function(request, response) { 

    let id = request.params.id;

    let status = await commentService.updateCommentById(id, new Comment(
        null,
        null,
        null,
        request.body.content
    ));


    if(status == 0) {
        response.status(202).send();
    }
    else if(status == -1) {
        response.status(400).send("Comment not found");
    }
    else {
        response.status(500).send();
    }
}


exports.deleteCommentById = async function(request, response) {

    let id = request.params.id;

    let status = await commentService.deleteCommentById(id);

    if(status == 0) {
        response.status(204).send();
    }
    else if(status == -1) {
        response.status(400).send("Comment not found");
    }
    else {
        response.status(500).send();
    }

}


exports.deleteLikeByCommentId = async function(request, response) {

    let id = request.params.id;

    let status = await likeService.deleteLikeByAuthorIdAndCommentId(
        request.body.author_id,
        id
    )

    if(status == 0) {
        response.status(204).send();
    }
    else if(status == -1) {
        response.status(400).send("User not found");
    }
    else if(status == -2) {
        response.status(400).send("Comment not found");
    }
    else if(status == -3) {
        response.status(400).send("Like not found");
    }
    else {
        response.status(500).send();
    }

 }