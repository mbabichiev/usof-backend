# Lib2Lib
Lib2Lib is a simple application where you can write, read and share your stories, poems, books with all copyrights preserved.

# Screenshots
The example of post:
![](https://lh3.googleusercontent.com/efTlmQ3s1NRdLoTqf_ulXyTJjJyCFta5v0R9-2cgzlwjNgOsGmmCUwDYn7o8g8EDI2jW4XO7NgPtl8whq9mTZsDaaQJJOK4-1T1dDdllEBebZt7Z9fUDw8fQCbeyzT_EWA=w1280)

Get users:
![](https://lh4.googleusercontent.com/RZEO4QCwvMJdTbOC2Vw1jKn1MkJbECvyxvG7f4fu4zRcK4FxffW89PdLdyFKxp8pcz2raVfU2zzYUlCBcv-0gGoJHAQcUJwV_1MDs3T7D_QqzGq-Y5-o7xwocNLQ7ENuRQ=w1280)

Create new category:
![](https://lh4.googleusercontent.com/H4sFrNDqlseZV33XOY2SFuTXCmnqtwevXND9HRs8tMpmpj6V1RtHnWbbvxMAslX3tsCO78tKf0it-_gKMlYmUxmcAtdiM-hgXz02U7fq-cKa4nxG8LJY4LAG9Vt5r_24zQ=w1280)
As you can see, we have "Status: 201 Created".

Example deleting comment:
![](https://lh6.googleusercontent.com/sjZhcdO7rHzCFouXOEuKa09pwdyv32lhXySWw1OaTceL1huXgoVhj_WVdx7y4hw-ACG7y3qQzZsWDCGLHcK1cu7RLDi1QAagw8Z7wZfn7vOarx_vIHlcvNYi2gbz5NHY=w1280)

Get comments by post id:
![](https://lh5.googleusercontent.com/PhidJjtWru_VGWRkYG014wBQwlL5N1PkpGX_dVU4r7LPefPjbER5sLdQ9vTiiJfZ9VGeayiBn0zvpgTQ9muG_BTucb2HrFVQ-S453dIN_RItqUwK0AcXnSToFYeRM0vOFQ=w1280)

# What you need to install project:
- node js
- mysql
- git
- Postman (or another API platforms for testing)

# Installation

First of all, clone the repository. To do this, enter the desired directory and write in the console:
```bash
git clone git@gitlab.ucode.world:connect-khpi/connect-fullstack-usof-backend/mbabichiev.git
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





