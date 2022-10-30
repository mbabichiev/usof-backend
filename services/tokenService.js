const TokenRepository = require("../repositories/tokenRepository.js")

class TokenService {

    constructor() {
        this.tokenRepository = new TokenRepository();
    }


    async checkIfTokenExistById(id) {
        let statement = `SELECT token FROM tokens WHERE id=${id};`
        let [rows, fields]  = await this.tokenRepository.createStatement(statement);
        
        if(String(rows) == '') {
            return false;
        }
        return true;
    }


    async insertTokenInDB(id, token) {
        console.log("Create token with id: " + id);

        let statement = `INSERT INTO tokens (id, token) VALUES (${id}, "${token}");`

        if(await this.tokenRepository.createStatement(statement) == -1) {
            console.log("User with id " + id + " is already have a token.");
            return -1;
        }
        return 0;  
    }

    
    async getTokenById(id) {
        console.log("Get token with id: " + id);

        let statement = `SELECT * FROM tokens WHERE id=${id};`
        let [rows, fields] = await this.tokenRepository.createStatement(statement);

        if(String(rows[0]) == '') {
            console.log("Token for user with id " + id + " not found")
            return null;
        }
        return rows[0];
    }


    async getIdByToken(token) {
        console.log("Get id with token: " + token);

        let statement = `SELECT id FROM tokens WHERE token="${token}";`
        let [rows, fields] = await this.tokenRepository.createStatement(statement);

        if(String(rows) != '') {
            console.log("Id for token " + token + " not found")
            return rows[0].id;
        }
        return null;
    }


    async deleteTokenById(id) {
        console.log("Delete token with id: " + id);

        if(await this.checkIfTokenExistById(id) === false) {
            console.log("Token with id " + id + "is not found");
            return -1;
        }

        let statement = `DELETE FROM tokens WHERE id=${id};`

        if(await this.tokenRepository.createStatement(statement) == -1) {
            console.log("Some error with deleting token.");
            return -2;
        }
        return 0;
    }
}


module.exports = TokenService;
