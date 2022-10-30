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