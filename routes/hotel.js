const hotelController  = require("../controller/hotelController");
const express = require("express");
const { imagePaths } = require("../dbconfig/constants");
const multer = require("multer");
const checkLogin = require("../middlewares/auth");
const errorHelper  = require("../helpers/errorHelper");
const { body, param } = require("express-validator");
const validator = require("validator");
const handleValidationErrors = require('../middlewares/handleValidationErrors')
const Hotel = require('../model/hotel')
const { doesnotContainRestrictedChars } = require("../helpers/filter");
const singleImageUploadValidation = require("../middlewares/singleImageUploadValidation");



const router = express.Router();

const hotelStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, imagePaths.hotels);
    },
    filename: function(req, file, cb) {
        const extn = file.originalname.split(".").pop().toLocaleLowerCase()

        // filename: product_<product_id>_<current-timestamp>.<file_extension>
        cb(
            null,`${file.fieldname}-${Date.now()}`+ "."+extn
        );
    },
});
const upload = multer({
    storage: hotelStorage,
});



router.post("/registerHotel",
checkLogin.isLoggedIn,
singleImageUploadValidation(),
upload.single("image"),
[
    body("name","Name must be between 5 and 40 characters.")
    .isLength({min:5,max:40})
    .custom(async (value,{req}) =>{
        if (doesnotContainRestrictedChars(value) == false) {
            throw new Error("Name cannot contain special characters");
          }
    }),
    body("location","Valid location is rquired")
    .exists()
    .custom(async (value,{req}) =>{
        if (doesnotContainRestrictedChars(value) == false) {
            throw new Error("Location cannot contain special characters");
          }
    }),
    body("contact","Valid phone no is required.")
    .exists()
    .custom(async(num,req)=>{
        if (num.length !== 10) {
            throw new Error("Phone number must be of length 10");
          }
          const hotel = await Hotel.findOne({ contact: num }).exec();
          if (hotel) {
            throw new Error("Hotel with that phone already exists");
          }
          return Promise.resolve("Phone doesnot exist in db");

    }),
    body("stars","Stars is required from 1 to 7.")
    .optional()
    .isLength({min:1,max:7})
    .isNumeric(),
    body("totalRooms","Valid room number is required.")
    .isNumeric(),
    body("images","Image for hotel is required.")
    .optional()


], 
handleValidationErrors(),
errorHelper.wrapAsync(hotelController.registerHotel));


router.get("/allHotels", errorHelper.wrapAsync(hotelController.allHotels));

router.get("/csvFile", errorHelper.wrapAsync(hotelController.csvFile));

module.exports = router;
