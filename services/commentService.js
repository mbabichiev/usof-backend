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
        return 0;
    }


    async getCommentById(id) {
        console.log("Get comment with id: " + id);

        if(await this.checkIfCommentExistById(id) === false) {
            return -1;
        }
        
        let statement = `SELECT * FROM comments WHERE id=${id};`
        let [rows, fields] = await this.commentRepository.createStatement(statement);

        return rows[0];
    }


    async #getDataByStatement(statement) {
        let [rows, fields] = await this.commentRepository.createStatement(statement);
        return rows;
    }


    async getCommentsUnderPostByLimitAndPageSortNew(limit, page, post_id) {
        console.log(`Get new comments with limit ${limit} on page ${page} and post id: ${post_id}`);
        let statement = `SELECT * FROM comments WHERE post_id=${post_id} ORDER BY publish_date DESC LIMIT ${limit} OFFSET ${limit * page - limit};`
        return this.#getDataByStatement(statement);
    }


    async getCommentsUnderPostByLimitAndPageSortOld(limit, page, post_id) {
        console.log(`Get old comments with limit ${limit} on page ${page} and post id: ${post_id}`);
        let statement = `SELECT * FROM comments WHERE post_id=${post_id} ORDER BY publish_date LIMIT ${limit} OFFSET ${limit * page - limit};`
        return this.#getDataByStatement(statement);
    }


    async getCommentsUnderPostByLimitAndPageSortPopular(limit, page, post_id) {
        console.log(`Get new comments with limit ${limit} on page ${page} and post id: ${post_id}`);
        let statement = `SELECT * FROM comments WHERE post_id=${post_id} ORDER BY likes-dislikes DESC LIMIT ${limit} OFFSET ${limit * page - limit};`
        return this.#getDataByStatement(statement);
    }


    async updateCommentById(id, comment) {
        console.log("Update comment with id: " + id);

        if(await this.checkIfCommentExistById(id) === false) {
            console.log("Comment not found")
            return -1;
        }

        let oldComment = await this.getCommentById(id);

        let statement = `UPDATE comments SET ` +  
        `author_id = ${!comment.getAuthorId() ? oldComment.author_id : comment.getAuthorId()},
        post_id = ${!comment.getPostId() ? oldComment.post_id : comment.getPostId()},
        publish_date = ${!comment.getPublishDate() ? oldComment.publish_date : comment.getPublishDate()},
        content = "${!comment.getContent() ? oldComment.content : comment.getContent()}",
        likes = ${!comment.getLikes() && comment.getLikes() !== 0 ? oldComment.likes : comment.getLikes()},
        dislikes = ${!comment.getDislikes() && comment.getDislikes() !==0 ? oldComment.dislikes : comment.getDislikes()} ` + `
        
        WHERE id = ${id};
        `

        if(await this.commentRepository.createStatement(statement) == -1) {
            return -2;
        }
        return 0;
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
        return 0;
    }
}

module.exports = CommentService;