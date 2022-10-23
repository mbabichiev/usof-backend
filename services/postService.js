const PostRepository = require("../repositories/postRepository.js")
const CategoryService = require("../services/categoryService.js")
const UserService = require("../services/userService");

class PostService {

    constructor() {
        this.postRepository = new PostRepository();
        this.categoryService = new CategoryService();
        this.userService = new UserService();
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


    async getAmountPostsByUserId(id) {

        console.log("Get amout of posts by user with id: " + id);

        if(await this.userService.checkIfUserExistById(id) === false) {
            console.log("User not found")
            return -1;
        }

        let statement = `SELECT count(*) AS total FROM posts WHERE author_id=${id};`

        let [rows, fields] = await this.postRepository.createStatement(statement);

        return rows[0];
    }


    async getAllPostByUserId(id) {

        console.log("Get all posts by user with id: " + id);

        if(await this.userService.checkIfUserExistById(id) === false) {
            console.log("User not found")
            return -1;
        }

        let statement = `SELECT * FROM posts WHERE author_id=${id};`

        let [rows, fields] = await this.postRepository.createStatement(statement);

        return rows;
    }


    async getPostsByLimitAndPage(limit, page) {
        console.log(`Get posts with limit ${limit} on page ${page}`);

        let statement = `SELECT * FROM posts LIMIT ${limit} OFFSET ${limit * page - limit};`

        let [rows, fields] = await this.postRepository.createStatement(statement);

        return rows;

    }


    async getFavouriveCategoryByUserId(id) {

        console.log("Get favourite category with user id: " + id);

        if(await this.userService.checkIfUserExistById(id) === false) {
            console.log("User not found")
            return -1;
        }

        let posts = await this.getAllPostByUserId(id);

        if(posts.length === 0) {
            return null
        }
        else if(posts.length === 1) {
            // get first category of post
            return posts[0].categories.split(',')[0];
        }
        else {
            let categoriesObj = [];

            for(var i = 0; posts[i]; i++) {

                let categories = posts[i].categories.split(',');

                for(var j = 0; categories[j]; j++) {

                    var exist = false;

                    for(var k = 0; categoriesObj[k]; k++) {
                        if(String(categoriesObj[k].id) === String(categories[j])) {
                            categoriesObj[k].num += 1;
                            exist = true;
                            break;
                        }
                    }

                    if(!exist) {
                        categoriesObj.push({
                            id: String(categories[j]),
                            num: 1 
                        })
                    }
                }
            }

            let favouriteCategoryId = 0;
            let favouriteCategoryNum = 0;

            for(var i = 0; categoriesObj[i]; i++) {
                if(categoriesObj[i].num > favouriteCategoryNum) {
                    favouriteCategoryId = Number(categoriesObj[i].id);
                    favouriteCategoryNum = categoriesObj[i].num;
                }
            }

            return favouriteCategoryId;
        }
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

