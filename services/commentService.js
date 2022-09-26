const CommentRepository = require("../repositories/commentRepository.js");
const PostService = require("../services/postService.js")
const UserService = require("../services/userService.js")

class CommentService {

    constructor() {
        this.commentRepository = new CommentRepository();
        this.postService = new PostService();
        this.userService = new UserService();
    }


    async checkIfCommentExistById(id) {
        let statement = `SELECT id FROM comments WHERE id=${id};`

        let [rows, fields]  = await this.commentRepository.createStatement(statement);
        
        if(String(rows) == '') {
            return false;
        }

        return true;
    }


    async createComment(comment) {

        console.log("Create comment");

        if(!comment.getAuthorId() || !comment.getPostId() || !comment.getPublishDate() || !comment.getContent()) {
            return -1;
        }

        if(await this.postService.checkIfPostExistById(comment.getPostId()) === false) {
            console.log("Post not found")
            return -2;
        }

        if(await this.userService.checkIfUserExistById(comment.getAuthorId()) === false) {
            console.log("User not found")
            return -3;
        }

        let statement = `INSERT INTO comments 
        (author_id, post_id, publish_date, content) 
        VALUES (${comment.getAuthorId()}, ${comment.getPostId()}, ${comment.getPublishDate()}, "${comment.getContent()}");`

        if(await this.commentRepository.createStatement(statement) == -1) {
            return -4;
        }
        else {
            return 0;
        }


    }


    async getCommentById(id) {

        console.log("Get comment with id: " + id);

        if(await this.checkIfCommentExistById(id) === false) {
            console.log("Comment not found")
            return -1;
        }
        
        let statement = `SELECT * FROM comments WHERE id=${id};`

        let [rows, fields] = await this.commentRepository.createStatement(statement);

        return rows[0];
    }


    async getAllCommentsByPostId(post_id) {

        console.log("Get comments on post with id: " + post_id);

        if(await this.postService.checkIfPostExistById(post_id) === false) {
            console.log("Post not found")
            return -1;
        }
        
        let statement = `SELECT * FROM comments WHERE post_id=${post_id};`

        let [rows, fields] = await this.commentRepository.createStatement(statement);

        return rows;
    }


    #createNullDataIfUnderfined(data) {
        return !data ? null : data
    }


    async updateCommentById(id, comment) {

        console.log("Update comment with id: " + id);

        if(await this.checkIfCommentExistById(id) === false) {
            console.log("Comment not found")
            return -1;
        }

        let oldComment = await this.getCommentById(id);

        let statement = `UPDATE comments SET ` +  
        `author_id = ${this.#createNullDataIfUnderfined(comment.getAuthorId()) == null ? oldComment.author_id : comment.getAuthorId()},
        post_id = ${this.#createNullDataIfUnderfined(comment.getPostId()) == null ? oldComment.post_id : comment.getPostId()},
        publish_date = ${this.#createNullDataIfUnderfined(comment.getPublishDate()) == null ? oldComment.publish_date : comment.getPublishDate()},
        content = "${this.#createNullDataIfUnderfined(comment.getContent()) == null ? oldComment.content : comment.getContent()}" ` + `
        
        WHERE id = ${id};
        `

        if(await this.commentRepository.createStatement(statement) == -1) {
            console.log("Some error with database: table comments")
            return -2;
        }
        else {
            return 0;
        }
    }


    async deleteCommentById(id) {

        console.log("Delete comment with id: " + id);

        if(await this.checkIfCommentExistById(id) === false) {
            console.log("Comment with id " + id + " is not found");
            return -1;
        }

        let statement = `DELETE FROM comments WHERE id=${id};`

        if(await this.commentRepository.createStatement(statement) == -1) {
            console.log("Some error with deleting comment.");
            return -2;
        }
        else {
            return 0;
        }
    }



}

module.exports = CommentService;