const userController  = require("../controller/userController");
const express = require("express");
const { imagePaths } = require("../dbconfig/constants");
const multer = require("multer");
const checkLogin = require("../middlewares/auth");
const errorHelper  = require("../helpers/errorHelper");
const { body, param } = require("express-validator");
const validator = require("validator");
const handleValidationErrors = require('../middlewares/handleValidationErrors')
const User = require('../model/user')
const { doesnotContainRestrictedChars } = require("../helpers/filter");
const singleImageUploadValidation = require("../middlewares/singleImageUploadValidation")

const path = require("path");



const router = express.Router();
console.log("File",imagePaths.user)

console.log(path.parse(__dirname))
const userStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null,imagePaths.user)
    },
    filename: function(req, file, cb) {
        const extn = file.originalname.split(".").pop().toLocaleLowerCase()
        const name = new Date()
        cb(
            null,`${file.fieldname}-${Date.now()}` + "." +extn
            // "profile.png"
        );
    },
});
const upload = multer({
    storage: userStorage,
});

router.post("/register", 
singleImageUploadValidation(),
upload.single("image"),

[
    body("name","Name must be between 5 and 40 characters.")
    .isLength({min:5,max:40})
    .custom(async (value,{req}) =>{
        console.log("BB",req.body)
        if (doesnotContainRestrictedChars(value) == false) {
            throw new Error("Name cannot contain special characters");
          }
    }),
    body("email","Valid email is required.")
    .isEmail()
    .custom(async (value,{req:req}) =>{
        const user = await User.findOne({ email: value }).exec();

        if (user) {
    
            throw new Error("User with that email already exists.")
          
        }

    }),
    body("phone","Valid phone is required.")
    .optional()
    .isNumeric()
    .custom(async(num,req)=>{
        if (num.length !== 10) {
            throw new Error("Phone number must be of length 10");
          }
          const user = await User.findOne({ phone: num }).exec();
  
          if (user) {
            return Promise.reject("User with that phone already exists");
          }
          return Promise.resolve("Phone doesnot exist in db");

    }),
    body("address","Valid Address is required")
    .optional(),
    
    body("confirm_password","Confirm password is required.")
    .exists(),
    body("password","Password is required with more than 8 characters.")
    .isLength({min:8 ,max: 60}) 
    .custom((value,{req})=>{
        return value === req.body.confirm_password
          ? Promise.resolve("Passwords match.")
          : Promise.reject("Passwords dont match.");
    

    }) ,
    body("image","Valid image is required.")
    .optional()   
],
handleValidationErrors(),
errorHelper.wrapAsync(userController.register));



router.post("/logIn",
[
    body("email_or_phone","Email or phone is required.")
    .exists()
    .notEmpty()
    .custom(async (value,{req:req})=>{
        console.log("Email",req.body)
        const isEmail = req.body.email_or_phone.match(/@/);
        if(isEmail){
            if(!validator.isEmail(req.body.email_or_phone)) throw new Error("Invalid email address.")
        }
        else{
            if(!validator.isNumeric(req.body.email_or_phone)) throw new Error("Invalid phone number")
        }
    }),
    body("password","Password cannot be empty.")
    .exists()
    .notEmpty()

],
handleValidationErrors(),
 errorHelper.wrapAsync(userController.logIn)
 );


router.get("/allUsers", checkLogin.isLoggedIn, errorHelper.wrapAsync(userController.allUsers));
module.exports = router;
