const Repository = require("./repository.js")

class CategoryRepository extends Repository {

    constructor() {
        super();
        
        let statement = `
        CREATE TABLE IF NOT EXISTS categories(
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(50) NOT NULL,
            description TEXT NOT NULL
        );`

        this.createStatement(statement);
    }
}

module.exports = CategoryRepository;