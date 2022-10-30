const Repository = require("./repository.js")

class CommentRepository extends Repository {

    constructor() {
        super();
        
        let statement = `
        CREATE TABLE IF NOT EXISTS comments(
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            author_id BIGINT NOT NULL,
            post_id BIGINT NOT NULL,
            publish_date BIGINT NOT NULL,
            content VARCHAR(255) NOT NULL,
            likes BIGINT DEFAULT(0),
            dislikes BIGINT DEFAULT(0)
        );`

        this.createStatement(statement);
    }
}

module.exports = CommentRepository;