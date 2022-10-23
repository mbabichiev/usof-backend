const UserService = require("../services/userService.js");
const User = require("../models/user.js");
const fs = require("fs");
const PostService = require("../services/postService.js");

const PostMapper = require("../utils/PostMapper");
const PhotoUploader = require("../utils/PhotoUploader");

let userService = new UserService();
let postService = new PostService();
let postMapper = new PostMapper();
let photoUploader = new PhotoUploader();


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

    if(!id.match(/^\d+$/)) {
        return response.status(400).send();
    }

    let data = await userService.getUserById(id);

    if(data) {

        let numOfPublications = await postService.getAmountPostsByUserId(data.id);

        if(numOfPublications === -1) {
            numOfPublications = 0;
        }

        let favouriteCategory = null;

        if(numOfPublications !== 0) {
            favouriteCategory = await postService.getFavouriveCategoryByUserId(data.id);
        }

        response.status(200).send({

            user: {
                id: data.id,
                login: data.login,
                full_name: data.full_name,
                email: data.email,
                rating: data.rating,
                number_of_publications: numOfPublications.total,
                favourite_category: favouriteCategory,
                role: data.role,
            }
        })
    }
    else {
        response.status(400).send("User is not found")
    }

};


exports.getUserAvatarById = function(request, response) {

    let id = request.params.id;

    if(!id.match(/^\d+$/)) {
        return response.status(400).send();
    }

    let path = photoUploader.getUserAvatarPathById(id);

    fs.readFile(path, function(err, data) {
        if(!err) {
            response.status(200).end(data)
        }
        else {
            console.log(err);
            response.status(500).end()
        }
    })
}


exports.getAllPostsByUserId = async function (request, response) {

    let id = request.params.id;

    if(!id.match(/^\d+$/)) {
        return response.status(400).send();
    }

    let data = await postService.getAllPostByUserId(id);
    let posts = []

    for(var i = 0; data[i]; i++) {
        posts.push(await postMapper.getPostJSON(data[i]));
    }

    response.status(200).send({
        posts: posts
    })

}


exports.uploadAvatar = function (request, response) {

    if (!request.files || Object.keys(request.files).length === 0) {
        return response.status(400).send('No files were uploaded');
    }

    let id = request.params.id;

    if(!id.match(/^\d+$/)) {
        return response.status(400).send();
    }

    let status = photoUploader.uploadAvatar(id, request.files.file);

    if(status === 0) {
        return response.status(200).send();
    }
    else if(status === -1) {
        return response.status(400).send("Avatar should be only .jpg, .png or .jpeg");
    }
    else {
        return response.status(500).send()
    }
}


exports.getDefaultAvatar = async function (request, response) {
    let path = 'avatars/no_avatar.png';

    fs.readFile(path, function(err, data) {
        if(!err) {
            response.status(200).end(data)
        }
        else {
            console.log(err);
            response.status(500).end()
        }
    })
}


exports.deleteAvatarById = async function (request, response) {

    let id = request.params.id;

    if(!id.match(/^\d+$/)) {
        return response.status(400).send();
    }
    photoUploader.deleteAvatarById(id);

    response.status(200).end()
}



exports.updateUser = async function (request, response) {

    let id = request.params.id;

    if(!id.match(/^\d+$/)) {
        return response.status(400).send();
    }

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

    if(!id.match(/^\d+$/)) {
        return response.status(400).send();
    }

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

