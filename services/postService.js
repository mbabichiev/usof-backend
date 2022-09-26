const PostRepository = require("../repositories/postRepository.js")
const CategoryService = require("../services/categoryService.js")

class PostService {

    constructor() {
        this.postRepository = new PostRepository();

        this.categoryService = new CategoryService();
    }


    async checkIfPostExistById(id) {
        let statement = `SELECT author_id FROM posts WHERE id=${id};`

        let [rows, fields]  = await this.postRepository.createStatement(statement);
        
        if(String(rows) == '') {
            return false;
        }

        return true;
    }


    async checkIfCategoriesExist(categories) {

        let arrCategories = String(categories).split(',')
        
        for(var i = 0; i < arrCategories.length; i++) {

            if(await this.categoryService.checkIfCategoryExistById(arrCategories[i]) === false) {
                return false;
            }

        }

        return true;
    }


    async createPost(post) {

        console.log("Create post");

        if(!post.getAuthorId() || !post.getTitle() || !post.getPublishDate() || !post.getStatus() || !post.getContent() || !post.getCategories()) {
            console.log("Post have null data");
            return -1;
        }

        if(await this.checkIfCategoriesExist(post.getCategories()) === false) {
            console.log("Categories not found")
            return -3;
        }

        let statement = `INSERT INTO posts 
        (author_id, title, publish_date, status, content, categories) 
        VALUES (${post.getAuthorId()}, "${post.getTitle()}", ${post.getPublishDate()}, "${post.getStatus()}", "${post.getContent()}", "${post.getCategories()}");`

        if(await this.postRepository.createStatement(statement) == -1) {
            console.log("Post already exist.");
            return -2;
        }
        else {
            return 0;
        }
        
    }


    async getAllPosts() {

        console.log("Get all posts");

        let statement = `SELECT * FROM posts;`

        let [rows, fields] = await this.postRepository.createStatement(statement);

        if(String(rows[0]) == '') {
            console.log("Posts not found")
            return null;
        }
        else {
            return rows;
        }
    }

    
    async getPostById(id) {
        
        console.log("Get post with id: " + id);

        if(await this.checkIfPostExistById(id) === false) {
            console.log("Post not found")
            return -1;
        }
        
        let statement = `SELECT * FROM posts WHERE id=${id};`

        let [rows, fields] = await this.postRepository.createStatement(statement);

        return rows[0];

    }


    #createNullDataIfUnderfined(data) {
        return !data ? null : data
    }


    async updatePostById(id, post) {

        console.log("Update post with id: " + id);

        if(await this.checkIfPostExistById(id) === false) {
            console.log("Post not found")
            return -1;
        }

        if(post.getCategories() != '' && post.getCategories() != null) { 
            if( await this.checkIfCategoriesExist(post.getCategories()) === false) {
                console.log("Categories not found")
                return -3;
            }
        }

        let oldPost = await this.getPostById(id);

        let statement = `UPDATE posts SET ` +  
        `author_id = ${this.#createNullDataIfUnderfined(post.getAuthorId()) == null ? oldPost.author_id : post.getAuthorId()},
        title = "${this.#createNullDataIfUnderfined(post.getTitle()) == null ? oldPost.title : post.getTitle()}",
        publish_date = ${this.#createNullDataIfUnderfined(post.getPublishDate()) == null ? oldPost.publish_date : post.getPublishDate()},
        status = "${this.#createNullDataIfUnderfined(post.getStatus()) == null ? oldPost.status : post.getStatus()}",
        content = "${this.#createNullDataIfUnderfined(post.getContent()) == null ? oldPost.content : post.getContent()}",
        categories = "${this.#createNullDataIfUnderfined(post.getCategories()) == null ? oldPost.categories : post.getCategories()}" ` + `
        
        WHERE id = ${id};
        `

        if(await this.postRepository.createStatement(statement) == -1) {
            console.log("Some error with database: table posts")
            return -2;
        }
        else {
            return 0;
        }

    }


    async deletePostById(id) {

        console.log("Delete post with id: " + id);

        if(await this.checkIfPostExistById(id) === false) {
            console.log("Post with id " + id + " is not found");
            return -1;
        }

        let statement = `DELETE FROM posts WHERE id=${id};`

        if(await this.postRepository.createStatement(statement) == -1) {
            console.log("Some error with deleting posts.");
            return -2;
        }
        else {
            return 0;
        }

    }

}


module.exports = PostService;

