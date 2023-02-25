const express = require("express");
const router = express.Router();
require("./dbconfig/dbconnection");
const jwt = require("./middlewares/auth");
const keyValueChecker = require("./middlewares/keyValueChecker");
const requestModifier = require("./middlewares/requestModifier");
// const route = require("./routes")
const { imagePaths } = require("./dbconfig/constants");
const path = require("path");
var fs = require("fs");

const multer = require("multer");

// const cors = require("cors");
const app = express();
const http = require("http");

// console.log("Stash 1")

const server = http.createServer(app);

const port = 3000;

const pathMain = router.all("/", (req, res) => {
    res.send("Server Hotel API Black Tech Interview");
});
const checker = router.use(keyValueChecker);
const request = router.use(requestModifier.customErrorLayer);
const auth = router.use(jwt.capturer);


// Converting 404 Error in /api to jsend responses


app.use(express.json());

app.use(checker);
app.use(request);
app.use(pathMain);
app.use(auth);
// app.use(route)
const validEndpoints = router.use("/",function (req,res,next){
    next();
},require("./routes"));

const error404 = router.use("/", function(req, res, next) {
    return res.json({
        status: "fail",
        message: "Cannot " + req.method + " " + req.protocol + "://" + req.get("host") + req.originalUrl + ". Maybe the resource was not found or request method is invalid."
    });
});

app.use(error404);
app.use("/public", express.static("public"));

if (!fs.existsSync(__dirname,"images")) {
    fs.mkdirSync(__dirname ,"images");
    console.log("Created new folder: " + __dirname + "images");
}
// Static Images Serving from configuration file at /configs/constants
for (const imagePath in imagePaths) {
    const goodPath = imagePaths[imagePath].split("/").join("/");
    const imageSavePath = path.join(__dirname,goodPath);
    //creating folders if they dont exist
    if (!fs.existsSync(imageSavePath)) {
        fs.mkdirSync(imageSavePath);
        console.log("Created new folder: " + imageSavePath);
    }
    app.use("/" + goodPath, express.static(path.join(__dirname, goodPath)));
}



server.listen(port, () => console.log("listening on port " + port));

