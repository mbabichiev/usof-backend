const fs = require("fs");

class PhotoUploader {

    constructor() {
        this.allowedFormats = ['jpg', 'png', 'jpeg'];
        this.avatars_dir = "avatars";
        this.posts_photo_dir = "posts_photo";
        this.no_avatar = `${this.avatars_dir}/no_avatar.png`;
    }


    // return path if file exists else return ''
    #getFilePathIfExist(dir, fileNameWithoutFormat) {
        for(var i = 0; i < this.allowedFormats.length; i++) {

            var path = `${dir}/${fileNameWithoutFormat}.${this.allowedFormats[i]}`

            if(fs.existsSync(path)) {
                return path;
            }
            else if(i === this.allowedFormats.length - 1) {
                return ''; 
            }
        }
    }



    // path of default avatar if file not exists
    // path of user avatar if file exists
    #getAvatarPathIfExist(dir, fileNameWithoutFormat) {
        let path = this.#getFilePathIfExist(dir, fileNameWithoutFormat);

        if(path === '') {
            path = this.no_avatar;
        }

        return path;
    }



    // return true if file format is validated
    // return false in another way
    #checkForValidatedFileFormat(fileFormat) {

        for(var i = 0; i < this.allowedFormats.length; i++) {
            if(this.allowedFormats[i] === fileFormat) {
                return true;
            }
            else {
                if(i === this.allowedFormats.length - 1 && this.allowedFormats[i] !== fileFormat) {
                    return false;
                }
            }
        }
    }



    // nothing to return
    #deleteFile(path) {
        console.log("Delete file: " + path)
        fs.unlink(path, err => {
            if(err) throw err; 
        });
    }



    // nothing to return
    #deleteFileIfExist(dir, fileNameWithoutFormat) {

        for(var i = 0; i < this.allowedFormats.length; i++) {
            let path = `${dir}/${fileNameWithoutFormat}.${this.allowedFormats[i]}`;
            if(fs.existsSync(path)) {
                this.#deleteFile(path);
                break;
            }
        }
    }



    // dir - directory
    // name - name of file (f.e. "26", "somefile"...)
    // file - file itself

    // return 0 if file saved
    // return -1 if file format is not validated
    // return -2 if it's fs error (server error)
    #savePhoto(dir, name, file) {

        if(!file) {
            return -3;
        }

        let fileFormat = file.name.split('.').pop();

        if(!this.#checkForValidatedFileFormat(fileFormat)) {
            return -1;
        }

        this.#deleteFileIfExist(dir, name);

        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        
        file.mv(`${dir}/${name}.${fileFormat}`, function(err) {

            if (err) {
                console.log(err);
                return -2;
            }
        });

        return 0;
    }



    // return 0 if file uploaded
    // return -1 if file format is not validated
    // return -2 if it's fs error (server error)
    uploadAvatar(id, file) {
        return this.#savePhoto(this.avatars_dir, id, file);        
    }



    // return 0 if file uploaded
    // return -1 if file format is not validated
    // return -2 if it's fs error (server error)
    uploadPostPhoto(id, file) {
        return this.#savePhoto(this.posts_photo_dir, id, file)
    }



    // return path of photo (if exists) or path of default avatar
    getUserAvatarPathById(id) {
        return this.#getAvatarPathIfExist(this.avatars_dir, id);
    }


    // return path of photo (if exists) or ''
    getPostPhotoPathById(id) {
        return this.#getFilePathIfExist(this.posts_photo_dir, id);
    }



    // nothing to return
    deleteAvatarById(id) {
        this.#deleteFileIfExist(this.avatars_dir, id);
    }



    // nothing to return
    deletePostPhotoById(id) {
        this.#deleteFileIfExist(this.posts_photo_dir, id);
    }
}

module.exports = PhotoUploader;