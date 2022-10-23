const LikeRepository = require("../repositories/likeRepository.js");

const UserService = require("../services/userService.js");
const PostService = require("../services/postService.js");
const CommentService = require("../services/commentService.js");
const User = require("../models/user.js");

class LikeService {

    constructor() {
        this.likeRepository = new LikeRepository();
        this.userService = new UserService();
        this.postService = new PostService();
        this.commentService = new CommentService();
    }


    async checkIfLikeExistById(id) {
        let statement = `SELECT id FROM likes WHERE id=${id};`

        let [rows, fields]  = await this.likeRepository.createStatement(statement);
        
        if(String(rows) == '') {
            return false;
        }

        return true;
    }


    async checkIfLikeExistUnderPost(author_id, post_id) {
        let statement = `SELECT id FROM likes WHERE entity="post" AND author_id=${author_id} AND entity_id=${post_id};`

        let [rows, fields]  = await this.likeRepository.createStatement(statement);
        
        if(String(rows) == '') {
            return false;
        }

        return true;
    }


    async getLikeIfExistByPostId(author_id, post_id) {

        let statement = `SELECT * FROM likes WHERE entity="post" AND author_id=${author_id} AND entity_id=${post_id};`

        let [rows, fields]  = await this.likeRepository.createStatement(statement);
        
        if(String(rows) == '') {
            return null;
        }

        return rows[0];
    }


    async getLikeIfExistByCommentId(author_id, comment_id) {

        let statement = `SELECT * FROM likes WHERE entity="comment" AND author_id=${author_id} AND entity_id=${comment_id};`

        let [rows, fields]  = await this.likeRepository.createStatement(statement);
        
        if(String(rows) == '') {
            return null;
        }

        return rows[0];
    }


    async checkIfLikeExistUnderComment(author_id, comment_id) {

        let statement = `SELECT id FROM likes WHERE entity="comment" AND author_id=${author_id} AND entity_id=${comment_id};`

        let [rows, fields]  = await this.likeRepository.createStatement(statement);
        
        if(String(rows) == '') {
            return false;
        }

        return true;
    }


    async changeUserRating(author_id, value) {

        let oldUser = await this.userService.getUserById(author_id);

        await this.userService.updateUserById(author_id, 
            new User(
                null,
                null,
                null,
                null,
                null,
                oldUser.rating + value, 
                null
            ));
    }


    async createLike(like) {

        console.log("Create like");

        if(!like.getAuthorId() || !like.getEntityId() || !like.getEntity() || !like.getType()) {
            return -1;
        }

        if(await this.userService.checkIfUserExistById(like.getAuthorId()) === false) {
            console.log("User not found")
            return -2;
        }

        if(like.getEntity() == "post") {

            if(await this.postService.checkIfPostExistById(like.getEntityId()) === false) {
                console.log("Post not found")
                return -3;
            }

            if(await this.checkIfLikeExistUnderPost(like.getAuthorId(), like.getEntityId())) {
                console.log("Like is already exist under with post")
                return -4;
            }

        }
        else {

            if(await this.commentService.checkIfCommentExistById(like.getEntityId()) === false) {
                console.log("Comment not found")
                return -5;
            }

            if(await this.checkIfLikeExistUnderComment(like.getAuthorId(), like.getEntityId())) {
                console.log("Like is already exist under with comment")
                return -6;
            }
        }


        let statement = `INSERT INTO likes 
        (author_id, entity_id, entity, type) 
        VALUES (${like.getAuthorId()}, ${like.getEntityId()}, "${like.getEntity()}", "${like.getType()}");`

        if(await this.likeRepository.createStatement(statement) == -1) {
            return -7;
        }
        else {

            if(like.getEntity() == "post") {

                let post = await this.postService.getPostById(like.getEntityId());

                if(!post) {
                    return -7;
                }

                if(like.getType() === "like") {
                    await this.changeUserRating(post.author_id, 1);
                }
                else {
                    await this.changeUserRating(post.author_id, -1);
                }
            }

            return 0;
        }

    }


    async getLikeById(id) {

        console.log("Get like with id: " + id);

        if(await this.checkIfLikeExistById(id) === false) {
            console.log("Like not found")
            return -1;
        }
        
        let statement = `SELECT * FROM likes WHERE id=${id};`

        let [rows, fields] = await this.likeRepository.createStatement(statement);

        return rows[0];
    }


    async getLikeIdByAuthorIdAndPostId(author_id, entity_id) {

        console.log("Get like with author_id: " + author_id);

        if(await this.userService.checkIfUserExistById(author_id) === false) {
            console.log("User not found")
            return -1;
        }

        if(await this.postService.checkIfPostExistById(entity_id) === false && await this.commentService.checkIfCommentExistById(entity_id) === false) {
            console.log("Like not found")
            return -2;
        }
        
        let statement = `SELECT id FROM likes WHERE author_id=${author_id} AND entity_id=${entity_id} AND entity="post";`

        let [rows, fields] = await this.likeRepository.createStatement(statement);

        if(rows[0]) {
            return rows[0].id;
        }
        else {
            return -3
        }
        
    }



    async getAllLikesByPostId(post_id) {

        console.log("Get likes under post with id: " + post_id);

        if(await this.postService.checkIfPostExistById(post_id) === false) {
            console.log("Post not found")
            return -1;
        }
        
        let statement = `SELECT * FROM likes WHERE entity="post" AND entity_id=${post_id};`

        let [rows, fields] = await this.likeRepository.createStatement(statement);

        return rows;
    }


    async getNumOfLikesByPostId(post_id) {

        console.log("Get num of likes under post id: " + post_id);

        if(await this.postService.checkIfPostExistById(post_id) === false) {
            console.log("Post not found")
            return -1;
        }

        let statement = `SELECT count(*) AS total FROM likes WHERE type="like" AND entity="post" AND entity_id=${post_id};`

        let [rows, fields] = await this.likeRepository.createStatement(statement);

        return rows[0];
    }


    async getNumOfLikesByCommentId(comment_id) {

        console.log("Get num of likes under comment id: " + comment_id);

        if(await this.commentService.checkIfCommentExistById(comment_id) === false) {
            console.log("Comment not found")
            return -1;
        }

        let statement = `SELECT count(*) AS total FROM likes WHERE type="like" AND entity="comment" AND entity_id=${comment_id};`

        let [rows, fields] = await this.likeRepository.createStatement(statement);

        return rows[0];
    }


    async getNumOfDislikesByPostId(post_id) {

        console.log("Get num of dislikes under post id: " + post_id);

        if(await this.postService.checkIfPostExistById(post_id) === false) {
            console.log("Post not found")
            return -1;
        }

        let statement = `SELECT count(*) AS total FROM likes WHERE type="dislike" AND entity="post" AND entity_id=${post_id};`

        let [rows, fields] = await this.likeRepository.createStatement(statement);

        return rows[0];
    }


    async getNumOfDislikesByCommentId(comment_id) {

        console.log("Get num of dislikes under comment id: " + comment_id);

        if(await this.commentService.checkIfCommentExistById(comment_id) === false) {
            console.log("Comment not found")
            return -1;
        }

        let statement = `SELECT count(*) AS total FROM likes WHERE type="dislike" AND entity="comment" AND entity_id=${comment_id};`

        let [rows, fields] = await this.likeRepository.createStatement(statement);

        return rows[0];
    }


    async getAllLikesByCommentId(comment_id) {

        console.log("Get likes under comment with id: " + comment_id);

        if(await this.commentService.checkIfCommentExistById(comment_id) === false) {
            console.log("Comment not found")
            return -1;
        }
        
        let statement = `SELECT * FROM likes WHERE entity="comment" AND entity_id=${comment_id};`

        let [rows, fields] = await this.likeRepository.createStatement(statement);

        return rows;
    }


    #createNullDataIfUnderfined(data) {
        return !data ? null : data
    }


    async updateLikeById(id, like) {

        console.log("Update like with id: " + id);

        if(await this.checkIfLikeExistById(id) === false) {
            console.log("Like not found")
            return -1;
        }

        let oldLike = await this.getLikeById(id);

        let statement = `UPDATE likes SET ` +  
        `author_id = ${this.#createNullDataIfUnderfined(like.getAuthorId()) == null ? oldLike.author_id : like.getAuthorId()},
        entity_id = ${this.#createNullDataIfUnderfined(like.getEntityId()) == null ? oldLike.entity_id : like.getEntityId()},
        entity = ${this.#createNullDataIfUnderfined(like.getEntity()) == null ? oldLike.entity : like.getEntity()},
        type = "${this.#createNullDataIfUnderfined(like.getType()) == null ? oldLike.type : like.getType()}" ` + `
        
        WHERE id = ${id};
        `

        if(await this.likeRepository.createStatement(statement) == -1) {
            console.log("Some error with database: table likes")
            return -2;
        }
        else {
            return 0;
        }
    }


    async deleteLikeById(id) {

        console.log("Delete like with id: " + id);

        if(await this.checkIfLikeExistById(id) === false) {
            console.log("Like with id " + id + " is not found");
            return -1;
        }

        let like = await this.getLikeById(id);

        let statement = `DELETE FROM likes WHERE id=${id};`

        if(await this.likeRepository.createStatement(statement) == -1) {
            console.log("Some error with deleting like.");
            return -2;
        }
        else {

            if(like.entity === "post") {
                if(like.type === "like") {
                    await this.changeUserRating(like.author_id, -1);
                }
                else {
                    await this.changeUserRating(like.author_id, 1);
                }
            }

            return 0;
        }
    }


    async deleteLikeByAuthorIdAndCommentId(author_id, comment_id) {

        console.log("Delete like with author id: " + author_id);

        if(await this.userService.checkIfUserExistById(author_id) === false) {
            console.log("User not found");
            return -1;
        }


        if(await this.commentService.checkIfCommentExistById(comment_id) === false) {
            console.log("Comment not found");
            return -2;
        }


        if(await this.checkIfLikeExistUnderComment(author_id, comment_id) === false) {
            console.log("Like with id " + comment_id + " is not found");
            return -3;
        }

        let statement = `DELETE FROM likes WHERE author_id=${author_id} AND entity_id=${comment_id} AND entity="comment";`

        if(await this.likeRepository.createStatement(statement) == -1) {
            console.log("Some error with deleting like.");
            return -4;
        }
        else {
            return 0;
        }
    }




}

module.exports = LikeService;