const UserRepository = require("../repositories/userRepository.js")

class UserService {

    constructor() {
        this.userRepository = new UserRepository();
    }


    async #checkIfDataExist(typeOfData, data) {
        let statement = `SELECT id FROM users WHERE ${typeOfData} = "${data}";`

        let [rows, fields]  = await this.userRepository.createStatement(statement);
        
        if(String(rows) == '') {
            return false;
        }

        return true;
    }


    async checkIfUserExistById(id) {
        return await this.#checkIfDataExist("id", id);
    }


    async checkIfUserExistByLogin(login) {
        return await this.#checkIfDataExist("login", login);
    }


    async checkIfEmailIsAlreadyUsed(email) {
        return await this.#checkIfDataExist("email", email);
    }

    async getUserIdByLogin(login) {

        let statement = `SELECT id FROM users WHERE login = "${login}";`

        let [rows, fields] = await this.userRepository.createStatement(statement);

        return rows[0].id;
    }


    async checkIfUserIsAdminById(id) {

        let statement = `SELECT role FROM users WHERE id=${id};`

        let [rows, fields] = await this.userRepository.createStatement(statement);

        let result = rows[0].role;

        if(String(result) == '' || result == "user") {
            return false;
        }
        
        return true;

    }


    async getUserIdByEmail(email) {

        let statement = `SELECT id FROM users WHERE email = "${email}";`

        let [rows, fields] = await this.userRepository.createStatement(statement);

        if(String(rows) != '') {
            return rows[0].id;
        }

        return null;
    }


    async checkIfCorrectPasswordForLogin(login, password) {

        let statement = `SELECT password FROM users WHERE login = "${login}";`

        let [rows, fields] = await this.userRepository.createStatement(statement);

        if(password != rows[0].password) {
            return false;
        }
        return true;

    }


    async createUser(user) {

        if(!user.getLogin() || !user.getPassword() || !user.getFullName() || !user.getEmail()) {
            return -1;
        }

        console.log("Create user with login: " + user.getLogin());

        if(await this.checkIfUserExistByLogin(user.getLogin()) === true) {
            console.log("User already exist.");
            return -2;
        }


        if(await this.checkIfEmailIsAlreadyUsed(user.getEmail()) === true) {
            console.log("The email is already used.");
            return -3;
        }

        let statement = `
        INSERT INTO users (login, password, full_name, email, role) 
        VALUES ("${user.getLogin()}", "${user.getPassword()}", "${user.getFullName()}", "${user.getEmail()}", "${user.getRole()}");`

        if(await this.userRepository.createStatement(statement) == -1) {
            return -4;
        }
        else {
            return 0;
        }

    }


    async getUserById(id) {

        console.log("Get user with id: " + id)

        let statement = `SELECT * FROM users WHERE id = "${id}";`

        let [rows, fields] = await this.userRepository.createStatement(statement);

        if(String(rows[0]) == '') {
            console.log("User with id " + id + " not found")
            return null;
        }
        else {
            return rows[0];
        }

    }


    async getAllUsers() {

        console.log("Get all users")

        let statement = `SELECT * FROM users;`

        let [rows, fields] = await this.userRepository.createStatement(statement);

        if(String(rows[0]) == '') {
            console.log("Users not found")
            return null;
        }
        else {
            return rows;
        }

    }


    async updateUserById(id, user) {

        console.log("Update user with id: " + id)

        let oldUser = await this.getUserById(id);

        if(oldUser === null) {
            console.log("User with id " + id + " not found")
            return -1;
        }

        let statement = `UPDATE users SET ` +  
        `login = "${(user.getLogin()) == null ? oldUser.login : user.getLogin()}",
        password = "${(user.getPassword()) == null ? oldUser.password : user.getPassword()}",
        full_name = "${(user.getFullName()) == null ? oldUser.full_name : user.getFullName()}",
        email = "${(user.getEmail()) == null ? oldUser.email : user.getEmail()}",
        profile_picture = "${(user.getProfilePicture()) == null ? oldUser.profile_picture : user.getProfilePicture()}",
        rating = ${(user.getRating()) == null ? oldUser.rating : user.getRating()},
        role = "${(user.getRole()) == null ? oldUser.role : user.getRole()}" ` + `
        
        WHERE id = ${id};
        `

        if(await this.userRepository.createStatement(statement) == -1) {
            console.log("Some error.");
            return -2;
        }
        else {
            return 0;
        }

    }


    async deleteUserById(id) {
        
        console.log("Delete user with id: " + id);

        if(await this.checkIfUserExistById(id) === false) {
            console.log("User not found with id: " + id);
            return -1;
        }

        let statement = `DELETE FROM users WHERE id = ${id};`

        if(await this.userRepository.createStatement(statement) == -1) {
            console.log("Some error.");
            return -2;
        }
        else {
            return 0;
        }

    }

}

module.exports = UserService;