const PostRepository = require("../repositories/postRepository.js")
const CategoryService = require("../services/categoryService.js")
const UserService = require("../services/userService");

const mysql_real_escape_string = require("../utils/mysql_real_escape_string");

class PostService {

    constructor() {
        this.postRepository = new PostRepository();
        this.categoryService = new CategoryService();
        this.userService = new UserService();
    }


    async checkIfPostExistById(id) {
        let statement = `SELECT author_id FROM posts WHERE id=${id};`
        let [rows, fields] = await this.postRepository.createStatement(statement);

        if (String(rows) == '') {
            return false;
        }
        return true;
    }


    async checkIfCategoriesExist(categories) {
        let arrCategories = String(categories).split(',')

        for (var i = 0; i < arrCategories.length; i++) {
            if (await this.categoryService.checkIfCategoryExistById(arrCategories[i]) === false) {
                return false;
            }
        }

        return true;
    }


    async createPost(post) {
        console.log("Create post");

        if (!post.getAuthorId() || !post.getTitle() || !post.getPublishDate() || !post.getStatus() || !post.getContent() || !post.getCategories()) {
            console.log("Post have null data");
            return -1;
        }

        if (await this.checkIfCategoriesExist(post.getCategories()) === false) {
            console.log("Categories not found")
            return -3;
        }

        let statement = `INSERT INTO posts 
        (author_id, title, publish_date, status, content, categories) 
        VALUES (${post.getAuthorId()}, "${mysql_real_escape_string(post.getTitle())}", ${post.getPublishDate()}, "${post.getStatus()}", "${mysql_real_escape_string(post.getContent())}", "${post.getCategories()}");`

        if (await this.postRepository.createStatement(statement) == -1) {
            console.log("Post already exist.");
            return -2;
        }
        return 0;
    }


    async #getDataByStatement(statement) {
        let [rows, fields] = await this.postRepository.createStatement(statement);
        return rows;
    }


    async getPostsByLimitAndPageSortNew(limit, page) {
        console.log(`Get new posts with limit ${limit} on page ${page}`);
        let statement = `SELECT * FROM posts ORDER BY publish_date DESC LIMIT ${limit} OFFSET ${limit * page - limit};`
        return this.#getDataByStatement(statement);
    }


    async getPostsByLimitAndPageSortOld(limit, page) {
        console.log(`Get old posts with limit ${limit} on page ${page}`);
        let statement = `SELECT * FROM posts ORDER BY publish_date LIMIT ${limit} OFFSET ${limit * page - limit};`
        return this.#getDataByStatement(statement);
    }


    async getPostsByLimitAndPageSortPopular(limit, page) {
        console.log(`Get popular posts with limit ${limit} on page ${page}`);
        let statement = `SELECT * FROM posts ORDER BY likes-dislikes DESC LIMIT ${limit} OFFSET ${limit * page - limit};`
        return this.#getDataByStatement(statement);
    }


    async getPostsCategoryByLimitAndPageSortNew(limit, page, category_id) {
        console.log(`Get new posts with limit ${limit} on page ${page} with category_id: ${category_id}`);
        let statement = `SELECT * FROM posts  
        WHERE categories LIKE '${category_id}'  
        OR categories LIKE '${category_id},%' 
        OR categories LIKE '%,${category_id},%' 
        OR categories LIKE '%,${category_id}' 
        ORDER BY publish_date DESC LIMIT ${limit} OFFSET ${limit * page - limit};`
        return this.#getDataByStatement(statement);
    }


    async getPostsCategoryByLimitAndPageSortOld(limit, page, category_id) {
        console.log(`Get old posts with limit ${limit} on page ${page} with category_id: ${category_id}`);
        let statement = `SELECT * FROM posts  
        WHERE categories LIKE '${category_id}'  
        OR categories LIKE '${category_id},%' 
        OR categories LIKE '%,${category_id},%' 
        OR categories LIKE '%,${category_id}' 
        ORDER BY publish_date LIMIT ${limit} OFFSET ${limit * page - limit};`
        return this.#getDataByStatement(statement);
    }


    async getPostsCategoryByLimitAndPageSortPopular(limit, page, category_id) {
        console.log(`Get popular posts with limit ${limit} on page ${page} with category_id: ${category_id}`);
        let statement = `SELECT * FROM posts  
        WHERE categories LIKE '${category_id}'  
        OR categories LIKE '${category_id},%' 
        OR categories LIKE '%,${category_id},%' 
        OR categories LIKE '%,${category_id}' 
        ORDER BY likes-dislikes DESC LIMIT ${limit} OFFSET ${limit * page - limit};`
        return this.#getDataByStatement(statement);
    }


    async getUsersCategoryByLimitAndPageSortNew(limit, page, user_id) {
        console.log(`Get new posts with limit ${limit} on page ${page} with user_id: ${user_id}`);
        let statement = `SELECT * FROM posts WHERE author_id=${user_id} ORDER BY publish_date DESC LIMIT ${limit} OFFSET ${limit * page - limit};`
        return this.#getDataByStatement(statement);
    }


    async getUsersCategoryByLimitAndPageSortOld(limit, page, user_id) {
        console.log(`Get old posts with limit ${limit} on page ${page} with user_id: ${user_id}`);
        let statement = `SELECT * FROM posts WHERE author_id=${user_id} ORDER BY publish_date LIMIT ${limit} OFFSET ${limit * page - limit};`
        return this.#getDataByStatement(statement);
    }


    async getUsersCategoryByLimitAndPageSortPopular(limit, page, user_id) {
        console.log(`Get popular posts with limit ${limit} on page ${page} with user_id: ${user_id}`);
        let statement = `SELECT * FROM posts WHERE author_id=${user_id} ORDER BY likes-dislikes DESC LIMIT ${limit} OFFSET ${limit * page - limit};`
        return this.#getDataByStatement(statement);
    }


    async getPostsBySearch(limit, data) {
        console.log("Get posts by data search " + data + ", limited by " + limit);
        let statement = `SELECT * FROM posts WHERE title LIKE '%${mysql_real_escape_string(data)}%' ORDER BY likes-dislikes DESC LIMIT ${limit};`
        return this.#getDataByStatement(statement);
    }


    async getPostById(id) {
        console.log("Get post with id: " + id);

        if (await this.checkIfPostExistById(id) === false) {
            console.log("Post not found")
            return -1;
        }

        let statement = `SELECT * FROM posts WHERE id=${id};`
        let [rows, fields] = await this.postRepository.createStatement(statement);

        return rows[0];
    }


    async getAmountPostsByUserId(id) {
        console.log("Get amout of posts by user with id: " + id);

        if (await this.userService.checkIfUserExistById(id) === false) {
            console.log("User not found")
            return -1;
        }

        let statement = `SELECT count(*) AS total FROM posts WHERE author_id=${id};`
        let [rows, fields] = await this.postRepository.createStatement(statement);

        return rows[0];
    }


    async getAllPostByUserId(id) {
        console.log("Get all posts by user with id: " + id);

        if (await this.userService.checkIfUserExistById(id) === false) {
            console.log("User not found")
            return -1;
        }

        let statement = `SELECT * FROM posts WHERE author_id=${id};`
        return this.#getDataByStatement(statement);
    }


    async getFavouriveCategoryByUserId(id) {
        console.log("Get favourite category with user id: " + id);

        if (await this.userService.checkIfUserExistById(id) === false) {
            console.log("User not found")
            return -1;
        }

        let posts = await this.getAllPostByUserId(id);

        if (posts.length === 0) {
            return null
        }

        if (posts.length === 1) {
            return posts[0].categories.split(',')[0];
        }

        let categoriesObj = [];

        for (var i = 0; posts[i]; i++) {
            let categories = posts[i].categories.split(',');

            for (var j = 0; categories[j]; j++) {
                var exist = false;

                for (var k = 0; categoriesObj[k]; k++) {
                    if (String(categoriesObj[k].id) === String(categories[j])) {
                        categoriesObj[k].num += 1;
                        exist = true;
                        break;
                    }
                }

                if (!exist) {
                    categoriesObj.push({
                        id: String(categories[j]),
                        num: 1
                    })
                }
            }
        }

        let favouriteCategoryId = 0;
        let favouriteCategoryNum = 0;

        for (var i = 0; categoriesObj[i]; i++) {
            if (categoriesObj[i].num > favouriteCategoryNum) {
                favouriteCategoryId = Number(categoriesObj[i].id);
                favouriteCategoryNum = categoriesObj[i].num;
            }
        }

        return favouriteCategoryId;
    }


    #createNullDataIfUnderfined(data) {
        return !data ? null : data
    }


    async updatePostById(id, post) {
        console.log("Update post with id: " + id);

        if (await this.checkIfPostExistById(id) === false) {
            console.log("Post not found")
            return -1;
        }

        if (post.getCategories() != '' && post.getCategories() != null) {
            if (await this.checkIfCategoriesExist(post.getCategories()) === false) {
                console.log("Categories not found")
                return -3;
            }
        }

        let oldPost = await this.getPostById(id);

        let statement = `UPDATE posts SET ` +
            `author_id = ${!post.getAuthorId() ? oldPost.author_id : post.getAuthorId()},
        title = "${!post.getTitle() ? oldPost.title : mysql_real_escape_string(post.getTitle())}",
        publish_date = ${!post.getPublishDate() ? oldPost.publish_date : post.getPublishDate()},
        status = "${!post.getStatus() ? oldPost.status : post.getStatus()}",
        content = "${!post.getContent() ? mysql_real_escape_string(oldPost.content) : mysql_real_escape_string(post.getContent())}",
        categories = "${!post.getCategories() ? oldPost.categories : post.getCategories()}",
        likes = ${!post.getLikes() && post.getLikes() !== 0 ? oldPost.likes : post.getLikes()},
        dislikes = ${!post.getDislikes() && post.getDislikes() !== 0 ? oldPost.dislikes : post.getDislikes()} ` + `
        
        WHERE id = ${id};
        `

        if (await this.postRepository.createStatement(statement) == -1) {
            console.log("Some error with database: table posts")
            return -2;
        }
        return 0;
    }


    async deletePostById(id) {
        console.log("Delete post with id: " + id);

        if (await this.checkIfPostExistById(id) === false) {
            console.log("Post with id " + id + " is not found");
            return -1;
        }

        let statement = `DELETE FROM posts WHERE id=${id};`

        if (await this.postRepository.createStatement(statement) == -1) {
            console.log("Some error with deleting posts.");
            return -2;
        }
        return 0;
    }
}


module.exports = PostService;

