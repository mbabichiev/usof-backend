const Repository = require("./repository.js")

class UserRepository extends Repository {

    constructor() {
        super();
        
        let statement = `
        CREATE TABLE IF NOT EXISTS users(
             id BIGINT AUTO_INCREMENT PRIMARY KEY,
             login VARCHAR(50) UNIQUE NOT NULL,
             password VARCHAR(255) NOT NULL,
             full_name VARCHAR(50) NOT NULL,
             email VARCHAR(50) UNIQUE NOT NULL,
             rating BIGINT DEFAULT(0),
             role VARCHAR(25) DEFAULT("user")
        );`
        
        this.createStatement(statement);
    }
}

module.exports = UserRepository;