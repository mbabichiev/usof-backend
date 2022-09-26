class Comment {

    constructor(author_id, post_id, publish_date, content) {
        this.author_id = author_id;
        this.post_id = post_id;
        this.publish_date = publish_date;
        this.content = content;
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

}

module.exports = Comment;