const CategoryRepository = require("../repositories/categoryRepository.js");

class CategoryService {

    constructor() {
        this.categoryRepository = new CategoryRepository();
    }


    async checkIfCategoryExistById(id) {
        let statement = `SELECT id FROM categories WHERE id=${id};`

        let [rows, fields]  = await this.categoryRepository.createStatement(statement);
        
        if(String(rows) == '') {
            return false;
        }

        return true;
    }


    async checkIfCategoryExistByTitle(title) {
        let statement = `SELECT id FROM categories WHERE title="${title}";`

        let [rows, fields]  = await this.categoryRepository.createStatement(statement);
        
        if(String(rows) == '') {
            return false;
        }

        return true;
    }


    async createCategory(category) {

        console.log("Create category");

        if(!category.getTitle() || !category.getDescription()) {
            return -1;
        }

        if(await this.checkIfCategoryExistByTitle(category.getTitle())) {
            console.log("Category is already exist: " + category.getTitle())
            return -2;
        }


        let statement = `INSERT INTO categories 
        (title, description) 
        VALUES ("${category.getTitle()}", "${category.getDescription()}");`

        if(await this.categoryRepository.createStatement(statement) == -1) {
            return -3;
        }
        else {
            return 0;
        }
    }


    async getCategoryById(id) {

        console.log("Get category by id: " + id);

        if(await this.checkIfCategoryExistById(id) === false) {
            console.log("Category not found")
            return -1;
        }
        
        let statement = `SELECT * FROM categories WHERE id=${id};`

        let [rows, fields] = await this.categoryRepository.createStatement(statement);

        return rows[0];
    }


    async getAllCategories() {

        console.log("Get all categories");

        let statement = `SELECT * FROM categories;`

        let [rows, fields] = await this.categoryRepository.createStatement(statement);

        if(String(rows[0]) == '') {
            console.log("Categories not found")
            return null;
        }
        else {
            return rows;
        }
    }


    #createNullDataIfUnderfined(data) {
        return !data ? null : data
    }


    async updateCategoryById(id, category) {

        console.log("Update category with id: " + id);

        if(await this.checkIfCategoryExistById(id) === false) {
            console.log("Category not found")
            return -1;
        }

        let oldCategory = await this.getCategoryById(id);

        let statement = `UPDATE categories SET ` +  
        `title = "${this.#createNullDataIfUnderfined(category.getTitle()) == null ? oldCategory.title : category.getTitle()}",
        description = "${this.#createNullDataIfUnderfined(category.getDescription()) == null ? oldCategory.description : category.getDescription()}" ` + `
        
        WHERE id = ${id};
        `

        if(await this.categoryRepository.createStatement(statement) == -1) {
            console.log("Some error with database: table comments")
            return -2;
        }
        else {
            return 0;
        }
    }


    async deleteCategoryById(id) {

        console.log("Delete category with id: " + id);

        if(await this.checkIfCategoryExistById(id) === false) {
            console.log("Category with id " + id + " is not found");
            return -1;
        }

        let statement = `DELETE FROM categories WHERE id=${id};`

        if(await this.categoryRepository.createStatement(statement) == -1) {
            console.log("Some error with deleting category.");
            return -2;
        }
        else {

            return 0;
        }
    }

}

module.exports = CategoryService;