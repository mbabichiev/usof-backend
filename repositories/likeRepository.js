const Repository = require("./repository.js")

class LikeRepository extends Repository {

    constructor() {
        super();
        
        let statement = `
        CREATE TABLE IF NOT EXISTS likes(
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            author_id BIGINT NOT NULL,
            entity_id BIGINT NOT NULL,
            entity VARCHAR(25) NOT NULL,
            type VARCHAR(25) NOT NULL
        );`
        
        this.createStatement(statement);
    }

}

module.exports = LikeRepository;