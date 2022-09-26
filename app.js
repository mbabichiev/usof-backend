const express = require("express");
const bp = require('body-parser');

const userRouter = require("./routes/userRouter.js");
const authRouter = require("./routes/authRouter.js");
const postRouter = require("./routes/postRouter.js");
const categoryRouter = require("./routes/categoryRouter.js");
const commentRouter = require("./routes/commentRouter.js");

const app = express();
const port = 3000;
const host = "127.0.0.1";


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
    console.log(`App started on PORT ${port}\nhttp://${host}:${port}`);
});

