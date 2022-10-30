class Post {

    constructor(author_id, title, publish_date, status, content, categories, likes, dislikes) {
        this.author_id = author_id;
        this.title = title;
        this.publish_date = publish_date;
        this.status = status;
        this.content = content;
        this.categories = categories;
        this.likes = likes;
        this.dislikes = dislikes;
    }

    getAuthorId() {
        return this.author_id;
    }

    getTitle() {
        return this.title;
    }

    getPublishDate() {
        return this.publish_date;
    }

    getStatus() {
        return this.status;
    }

    getContent() {
        return this.content;
    }

    getCategories() {
        return this.categories;
    }

    getLikes() {
        return this.likes;
    }

    getDislikes() {
        return this.dislikes;
    }
}


module.exports = Post;