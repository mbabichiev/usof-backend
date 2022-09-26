const mysql = require("mysql2");
const config = require('../resources/db.json');

class Repository {

    async createStatement(statement) {

        this.connection = mysql.createConnection({ 
            host     : config.db.host,
            user     : config.db.user,
            password : config.db.password,
            database : config.db.database
        });

        this.connection.connect();
        let result;

        try {
            result = await this.connection.promise().query(statement);
        } 
        catch (err) {
            console.error(err)
            return -1;
        }

        this.connection.end();

        return result;

    }


}

module.exports = Repository;