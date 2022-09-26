# Lib2Lib
Lib2Lib is a simple application where you can write, read and share your stories, poems, books with all copyrights preserved.

# Screenshots
The example of post:
![photo_2022-09-26_21-39-44](https://user-images.githubusercontent.com/105050372/192383774-18c4fc45-3695-442e-a5c9-240ece0e8b36.jpg)

Get users:
![photo_2022-09-26_21-39-47](https://user-images.githubusercontent.com/105050372/192384182-c20c205b-7382-4540-88b9-4883b0832f47.jpg)


Create new category:
![photo_2022-09-26_21-39-52](https://user-images.githubusercontent.com/105050372/192384234-3304e4cb-c1f7-49b5-b94f-84b9fbc9328c.jpg)
As you can see, we have "Status: 201 Created".

Example deleting comment:
![photo_2022-09-26_21-39-56](https://user-images.githubusercontent.com/105050372/192384304-74cfbc8a-1953-497f-b7e4-701a59029df1.jpg)


Get comments by post id:
![photo_2022-09-26_21-39-58](https://user-images.githubusercontent.com/105050372/192384361-df0761db-82e6-429c-b0ed-8568b176d7b9.jpg)


# What you need to install project:
- node js
- mysql
- git
- Postman (or another API platforms for testing)

# Installation

First of all, clone the repository. To do this, enter the desired directory and write in the console:
```bash
git clone https://github.com/scriptsh/usof-backend.git
```

After that install all libraries:
```bash
npm install
```

Now you should create database for project. Enter:
```bash
CREATE DATABASE IF NOT EXISTS libtolib;
```
or run the script `/resources/create_db.sql`:
```bash
sql create_db.sql;
```

In `/resources/db.json` you can change parameters of your ***user***, ***password*** etc.
Everything is fine. Now run the server:
```bash
node app.js
```
App is working.





