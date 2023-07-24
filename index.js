const express = require("express");
const app = express();
const port = 8081;
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({//we can use json in place of send but it will send only json data and with send we can send text data as well
        message: "Server is up and running",
    })
})

app.get("*", (req, res) => {
    res.status(200).json({
        message: "wrong route",
    })
})

app.listen(port, () => {
    console.log(`Server is  running  at port ${port}`);
})