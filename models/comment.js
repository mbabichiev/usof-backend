class Comment {

    constructor(author_id, post_id, publish_date, content, likes, dislikes) {
        this.author_id = author_id;
        this.post_id = post_id;
        this.publish_date = publish_date;
        this.content = content;
        this.likes = likes;
        this.dislikes = dislikes;
    }

    getAuthorId() {
        return this.author_id;
    }

    getPostId() {
        return this.post_id;
    }

    getPublishDate() {
        return this.publish_date;
    }

    getContent() {
        return this.content;
    }

    getLikes() {
        return this.likes;
    }

    getDislikes() {
        return this.dislikes;
    }
}

module.exports = Comment;