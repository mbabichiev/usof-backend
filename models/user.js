class User {

    constructor(login, password, full_name, email, profile_picture, rating, role) {
        this.login = login;
        this.password = password;
        this.full_name = full_name;
        this.email = email;
        this.profile_picture = profile_picture;
        this.rating = rating;
        this.role = role;
    }

    getLogin() {
        return this.login;
    }

    getPassword() {
        return this.password;
    }

    getFullName() {
        return this.full_name;
    }

    getEmail() {
        return this.email;
    }

    getProfilePicture() {
        return this.profile_picture;
    }

    getRating() {
        return this.rating;
    }

    getRole() {
        return this.role;
    }
}

module.exports = User;