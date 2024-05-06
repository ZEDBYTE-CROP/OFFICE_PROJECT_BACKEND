require('dotenv').config()
const express = require("express");
const cors = require("cors");

const account = require("./route/account.route");
const file = require("./route/file.route");

const app = express();

// cors options
var corsOptions = {
    origin: ['http://localhost:5173','http://localhost:5000', 'https://office-project-backend.onrender.com'],
    credentials: true,
    optionsSuccessStatus: 200,
    exposedHeaders: ['CL-X-TOKEN','CL-X-REFRESH']
};

// app.use(cors());
app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

//ROUTES (add as many)
app.use("/account", account);
app.use("/file", file);
app.get("/", function (req, res) {
    res.send("<p>Hello there!</p>");
});


app.use(express.json())

//Listening to the server
app.listen(process.env.PORT, process.env.URL, function () {
    console.log(`🚀Server is running on Host: http://${process.env.URL}:${process.env.PORT}`);
});
