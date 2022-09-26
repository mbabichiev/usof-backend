const Repository = require("./repository.js")

class TokenRepository extends Repository {

    constructor() {
        super();
        
        let statement = `
        CREATE TABLE IF NOT EXISTS tokens(
             id BIGINT PRIMARY KEY,
             token VARCHAR(50) UNIQUE NOT NULL
        );`
        
        this.createStatement(statement);
    }

}

module.exports = TokenRepository;