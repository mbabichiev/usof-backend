const express = require("express");
const cors = require('cors');
const bp = require('body-parser');
const fileUpload = require('express-fileupload');

const userRouter = require("./routes/userRouter.js");
const authRouter = require("./routes/authRouter.js");
const postRouter = require("./routes/postRouter.js");
const categoryRouter = require("./routes/categoryRouter.js");
const commentRouter = require("./routes/commentRouter.js");

const app = express();
const port = 8080;
const host = "127.0.0.1";

app.use(cors({
    origin: ['http://localhost:3000']
}));

app.use(fileUpload())
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/comments", commentRouter);

app.use(function (req, res, next) {
    res.status(404).send("Not Found")
});
 
app.listen(port, host, function() {
    console.log(`Server started on PORT ${port}\nhttp://${host}:${port}`);
});

