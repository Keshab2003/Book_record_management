const express = require("express");
const { users } = require("./data/users.json");//importing the data from a JSON file

const userRouter = require("./routes/users");
const bookRouter = require("./routes/books");

const app = express();
const port = 8081;

app.use(express.json());//this signifies that it accept JSON files
app.use("/users", userRouter);
app.use("/books", bookRouter);

app.get("/", (req, res) => {
    res.status(200).json({//we can use json in place of send but it will send only json data and with send we can send text data as well
        message: "Server is up and running",
    });
});




app.get("*", (req, res) => {
    res.status(200).json({
        message: "wrong route",
    })
})

app.listen(port, () => {
    console.log(`Server is  running  at port ${port}`);
})