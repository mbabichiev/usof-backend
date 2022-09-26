const UserService = require("../services/userService.js")
const User = require("../models/user.js");

let userService = new UserService();


exports.createUser = async function (request, response) {

    if(!request.body.role) {
        request.body.role = "user";
    }

    let status = await userService.createUser(new User(
        request.body.login,
        request.body.password,
        String(request.body.firstname) + ' ' + String(request.body.lastname),
        request.body.email,
        null,
        0,
        request.body.role
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
};


exports.getUsers = async function(request, response) {

    let data = await userService.getAllUsers();

    response.status(200).send({
        users: data
    })
};


exports.getUserById = async function(request, response) {

    let id = request.params.id;

    let data = await userService.getUserById(id);

    if(data) {
        response.status(200).send({
            user: data
        })
    }
    else {
        response.status(400).send("User is not found")
    }

};


exports.uploadAvatar = function (request, response) {
    response.status(200).send()
}


exports.updateUser = async function (request, response) {

    let id = request.params.id;
    let oldUser = await userService.getUserById(id);

    if(!oldUser) {
        response.status(400).send(`User is not found`)
        return;
    }


    if(request.body.login != oldUser.login) {

        if(await userService.checkIfUserExistByLogin(request.body.login)) {
            response.status(400).send(`User with login ${request.body.login} already exists`)
            return;
        }
    }

    if(request.body.email != oldUser.email) {
        if(await userService.checkIfEmailIsAlreadyUsed(request.body.email)) {
            response.status(400).send(`Email ${request.body.email} already in use`)
            return;
        }
    }

    let firstname = request.body.firstname;
    if(!firstname) {
        firstname = String(oldUser.full_name).split(' ')[0];
    }

    let lastname = request.body.lastname;
    if(!lastname) {
        lastname = String(oldUser.full_name).split(' ')[1];
    }


    let user = new User(
        request.body.login,
        null,
        String(firstname) + ' ' + String(lastname),
        request.body.email,
        null,
        null,
        request.body.role
    )

    let status = await userService.updateUserById(id, user)

    if(status == 0) {
        response.status(202).send()
    }
    else if(status == -1) {
        response.status(400).send("User is not found");
    }
    else {
        response.status(500).send();
    }
}


exports.deleteUser = async function (request, response) {
    let id = request.params.id;

    let status = await userService.deleteUserById(id);

    if(status == 0) {
        response.status(204).send()
    }
    else if(status == -1) {
        response.status(400).send("User is not found");
    }
    else {
        response.status(500).send();
    }

}

