const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require('uuid');

const User = require("../models/user.js");
const UserService = require("../services/userService.js");
const TokenService = require("../services/tokenService.js");

let userService = new UserService();
let tokenService = new TokenService();


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
        let is = await userService.getUserIdByLogin(request.body.login);
        response.status(201).send("id=" + is)
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


exports.checkLoginAndPassword = async function (request, response) {

    let login = request.body.login;
    let password = request.body.password;

    if(await userService.checkIfUserExistByLogin(login) === false) {
        response.status(400).send(`User with the login ${login} is not found`)
    }
    else if(await userService.checkIfCorrectPasswordForLogin(login, password) === false) {
        response.status(400).send("Wrong password")
    }
    else {
        let id = await userService.getUserIdByLogin(request.body.login);
        response.status(200).send("id=" + id)
    }
}


exports.logout = function (request, response){
    response.status(200).send()
};


async function sendEmail(fromEmail, toEmail, title, text, html) {

    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, 
        auth: {
            user: testAccount.user,
            pass: testAccount.pass, 
        },
        tls: {
            rejectUnauthorized: false
          }
    });

    let result = await transporter.sendMail({
        from: fromEmail,
        to: toEmail, 
        subject: title, 
        text: text,
        html: html
    });

    console.log("Message sent: %s", result.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(result));
}


exports.resetPasswordAndSendToEmail = async function (request, response){

    let email = request.body.email;

    if(!email) {
        response.status(400).send("Email is null")
        return;
    }

    let id = await userService.getUserIdByEmail(email);

    if(!id) {
        response.status(400).send(`Email ${email} is not in use`)
        return;
    }

    let token = uuidv4();
    let status = await tokenService.insertTokenInDB(id, token);

    if(status == -1) {
        await tokenService.deleteTokenById(id);
        await tokenService.insertTokenInDB(id, token);
    }
    
    let text = "Hello. Your password reset token: " + token;

    await sendEmail('"Lib To Lib" <lib.to.lib@gmail.com>', email, "Reset password", text, "<p>" + text + "</p>");

    response.status(200).send()

};


exports.passwordResetWithToken = async function (request, response){

    let token = request.params.token;
    let password = request.body.password;

    if(!token) {
        response.status(400).send("Token is null");
        return;
    } 

    if(!password) {
        response.status(400).send("Password is null");
        return;
    } 

    let id = await tokenService.getIdByToken(token);

    if(!id) {
        response.status(400).send("Token not found");
        return;
    }

    let status = await userService.updateUserById(id, 
        new User(null, password, null, null, null, null, null));


    if(status == 0) {
        await tokenService.deleteTokenById(id);
        response.status(202).send("id=" + id);
        return;
    }
    

    if(status == -1) {
        response.status(400).send("User not found");
        return;
    }


    response.status(500).send();

};

