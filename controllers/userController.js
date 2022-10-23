const UserService = require("../services/userService.js")
const User = require("../models/user.js");
const fs = require("fs");
const PostService = require("../services/postService.js");
const LikeService = require("../services/likeService.js");
const CategoryService = require("../services/categoryService.js");

const PostMapper = require("../utils/PostMapper")

let userService = new UserService();
let postService = new PostService();
let likeService = new LikeService();
let categoryService = new CategoryService();
let postMapper = new PostMapper();


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

    if(!id) {
        return response.status(400).send("Id is null");
    }

    let dir = 'avatars'
    let path = `${dir}/no_avatar.png`;

    if(fs.existsSync(`${dir}/${id}.jpg`)) {
        path = `${dir}/${id}.jpg`;
    }
    else if(fs.existsSync(`${dir}/${id}.png`)) {
        path = `${dir}/${id}.png`;
    }
    else if(fs.existsSync(`${dir}/${id}.jpeg`)) {
        path = `${dir}/${id}.jpeg`;
    }

    fs.readFile(path, function(err, data) {

        if(!err) {
            response.status(200).end(data)
        }
        else {
            console.log(err);
        }

    })
}


async function getCategoriesJSON(categoriesId, post_id) {

    let categoriesJSON = [];
    let categoriesFilter = [];

    let categories = String(categoriesId).split(',');
    let checkNeedToDelete = false;

    for(var i = 0; i < categories.length; i++) {

        var category = await categoryService.getCategoryById(categories[i]);

        if(category != -1) {
            categoriesJSON.push({
                id: category.id,
                title: category.title,
                description: category.description
            })

            categoriesFilter.push(categories[i])
        }
        else {
            checkNeedToDelete = true;
        }
    }

    if(checkNeedToDelete === true) {

        await postService.updatePostById(post_id, 
            new Post(
                null, 
                null,
                null,
                null,
                null,
                categoriesFilter.join(',')
        ))
    }

    return categoriesJSON;
}



exports.getAllPostsByUserId = async function (request, response) {

    let id = request.params.id;

    if(!id) {
        return response.status(400).send("Id is null");
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


function deleteFile(file) {
    console.log("Delete file: " + file)

    fs.unlink(file, err => {
        if(err) throw err; 
    });
}


exports.uploadAvatar = function (request, response) {

    if (!request.files || Object.keys(request.files).length === 0) {
        return response.status(400).send('No files were uploaded');
    }

    let id = request.params.id;

    if(!id) {
        return response.status(400).send('Id is null');
    }

    let sampleFile = request.files.file;
    let fileFormat = sampleFile.name.split('.').pop();

    if(fileFormat != 'jpg' && fileFormat != 'png' && fileFormat != 'jpeg') {
        return response.status(400).send("Avatar should be only .jpg, .png or .jpeg")
    }

    let dir = 'avatars'

    if(fs.existsSync(`${dir}/${id}.jpg`)) {
        deleteFile(`${dir}/${id}.jpg`);
    }
    else if(fs.existsSync(`${dir}/${id}.png`)) {
        deleteFile(`${dir}/${id}.png`);
    }
    else if(fs.existsSync(`${dir}/${id}.jpeg`)) {
        deleteFile(`${dir}/${id}.jpeg`);
    }
    
    sampleFile.mv(`avatars/${id}.${fileFormat}`, function(err) {

        if (err) {
            console.log(err);
            return response.status(500).send();
        }
    
        response.status(200).send();
    });

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

