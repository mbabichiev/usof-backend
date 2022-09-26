const Repository = require("./repository.js")

class PostRepository extends Repository {

    constructor() {
        super();
        
        let statement = `
        CREATE TABLE IF NOT EXISTS posts(
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            author_id BIGINT NOT NULL,
            title VARCHAR(50) NOT NULL,
            publish_date BIGINT NOT NULL,
            status VARCHAR(50) NOT NULL,
            content TEXT NOT NULL,
            categories VARCHAR(100) NOT NULL
        );`
        
        this.createStatement(statement);
    }

}

module.exports = PostRepository;