const mysql = require("mysql2");
const config = require('../resources/db.json');

class Repository {

    async createStatement(statement) {
        let connection = mysql.createConnection({ 
            host     : config.db.host,
            user     : config.db.user,
            password : config.db.password,
            database : config.db.database
        });

        connection.connect();
        let result;

        try {
            result = await connection.promise().query(statement);
        } 
        catch (err) {
            console.error(err)
            return -1;
        }

        connection.end();

        return result;
    }
}

module.exports = Repository;