# Installation
```bash
git clone git@gitlab.ucode.world:connect-khpi/connect-fullstack-usof-backend/mbabichiev.git
```
```bash
npm install
```
```bash
CREATE DATABASE IF NOT EXISTS libtolib;
```
```bash
node app.js
```

config for database in `resources/db.json`:
```JavaScript
{
    "db": {
      "host": "localhost",
      "user": "root",
      "database": "libtolib",
      "password": "password"
    }
}
```

# Structure
The main file: `app.js`. 

The project consists of:
- ***routers***: call functions from controllers
- ***controllers***: call functions from services
- ***services***: send statements to repositories
- ***repositories***: work with statements, create tables for database

## Routers
You have ***routers*** required in `app.js`. All routers are in the directory `/routers`:

- authRouter
- userRouter
- postRouter
- commentRouter
- categoryRouter

Routers call to controller functions when a request arrives at a specific ***address*** and ***method***. For example (`authRourer.js`):
```JavaScript
const authRouter = express.Router();
authRouter.post("/register", authController.create);
``` 


## Controllers
You have controllers in the directory `/controllers`. For every router you have controller.

***More*** functions in controllers just get data from request, send data to services and get ***status***.

If `status == 0`, it means that everything is fine.

If `status != 0`, it means we have some errors. For example - creating user (`controllers/authController.js`):

```JavaScript
exports.create = async function (request, response){

    let status = await userService.createUser(new User(
        request.body.login,
        request.body.password,
        String(request.body.firstname) + ' ' + String(request.body.lastname),
        request.body.email,
        null,
        0,
        "user"
        ));

    if(status == 0) {
        response.status(201).send()
    }
    else if(status == -1) {
        response.status(400).send("User has null data")
    } 
    else if(status == -2) {
        response.status(400).send(`User with the login ${request.body.login} already exists`)
    }
    else if(status == -3) {
        response.status(400).send(`The email ${request.body.email} already in use`)
    }
    else {
        response.status(500).send()
    }
}
```

Some functions in services return `true` or `false`, so some functions in controllers should handle it. For example, login (`controllers/userController.js`):
```JavaScript
exports.checkLoginAndPassword = async function (request, response) {

    let login = request.body.login;
    let password = request.body.password;

    if(await userService.checkIfUserExistByLogin(login) === false)  {
        response.status(400).send(`User with the login ${login} is not found`)
    }
    else if(await userService.checkIfCorrectPasswordForLogin(login, password) === false) {
        response.status(400).send("Wrong password")
    }
    else {
        response.status(200).send()
    }
}
```

## Services

You have services in `/services`. Services get data from **controllers** and create statements for table. For example - creating user (`services/userService.js`):
```JavaScript
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
```

## Repositories

Repositories just **create** tables and **extends class Repository**. For example, `repositories/userRepository.js`:

```JavaScript
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
             profile_picture VARCHAR(50),
             rating BIGINT DEFAULT(0),
             role VARCHAR(25) DEFAULT("user")
        );`
        
        this.createStatement(statement);
    }

}

module.exports = UserRepository;
```

or `repositories/categoryRepository.js`:

```JavaScript
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
```

***createStatement(statement)*** - **main** function in repository (`repositories/repository.js`), which connect to database, run statement and end connection:

```JavaScript
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
```

If you have some error in statement, this function return -1. 

**So, to create repository with new table you should extends class `repositories/repository.js`**.


## Models

For every service you should have **model**. Model is simple class with constructor and getters. For example, model Category (`models/category.js`):
```JavaScript
class Category {

    constructor(title, description) {
        this.title = title;
        this.description = description;
    }

    
    getTitle() {
        return this.title;
    }

    getDescription() {
        return this.description;
    }

}

module.exports = Category;
``` 

