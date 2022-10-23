const PostService = require("../services/postService.js")
const UserService = require("../services/userService.js")
const LikeService = require("../services/likeService.js")
const CategoryService = require("../services/categoryService.js")


class PostMapper {


    constructor() {
        this.postService = new PostService();
        this.userService = new UserService();
        this.likeService = new LikeService();
        this.categoryService = new CategoryService();
    }


    async getCategoriesJSON(categoriesId, post_id) {

        let categoriesJSON = [];
        let categoriesFilter = [];

        let categories = String(categoriesId).split(',');
        let checkNeedToDelete = false;

        for(var i = 0; i < categories.length; i++) {

            var category = await this.categoryService.getCategoryById(categories[i]);

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

            await this.postService.updatePostById(post_id, 
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


    async getPostJSON (post) {

        var user = await this.userService.getUserById(post.author_id)
        var likes = await this.likeService.getNumOfLikesByPostId(post.id)
        var dislikes = await this.likeService.getNumOfDislikesByPostId(post.id)

        return {
            id: post.id,
            author_id: post.author_id,
            author: user.full_name,
            title: post.title,
            status: post.status,
            likes: likes.total,
            dislikes: dislikes.total,
            publish_date: post.publish_date,
            categories: await this.getCategoriesJSON(post.categories, post.id),
            content: post.content
        }
    }

}

module.exports = PostMapper;