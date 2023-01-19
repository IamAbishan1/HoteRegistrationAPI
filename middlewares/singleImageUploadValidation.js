const multer = require("multer");
const fs = require("fs");

/*
Validation of single uploaded image:
usage

router.put('/asd', upload.single('image'), singleImageUploadValidation({
    allowedExtensions: [],
    maxFileSize: 3*1024,
    requestFieldName: 'image',
    mustUpload: false
})), handleValidationErrors(), function(req, res){}) ;

*/

function singleImageUploadValidation(configs = {}) {
  const defaultConfigs = {
    allowedExtensions: ["jpg", "jpeg", "png"],
    maxFileSize: 4 * 1024 * 1024,
    requestFieldName: "image",
    mustUpload: true,
  };

  configs = {
    ...defaultConfigs,
    ...configs,
  };

  if (!(configs.allowedExtensions instanceof Array))
    throw new Error("Array expected for allowedExtensions.");
  return async function (err, req, res, next) {
    if(err) return res.json({
      'status': 'error',
      'data': err.stack,
      'message': err.message
    })
    console.log("TT0",req.file)

    if (req.file !== undefined) {
      const extension = req.file.originalname
        .split(".")
        .pop()
        .toLocaleLowerCase();
      if (configs.allowedExtensions.indexOf(extension) === -1) {
        req.customErrors.set(
          configs.requestFieldName,
          "Invalid image extension: " + extension
        );
      }
      if (req.file.size > configs.maxFileSize) {
        //file size exceed
        req.customErrors.set(
          configs.requestFieldName,
          "File size should be less than " +
            configs.maxFileSize / 1024 / 1024 +
            "MB."
        );
      }
      //deleting uploaded file if there was error
      if (req.customErrors.get(configs.requestFieldName) != null) {
        fs.unlinkSync(req.file.path);
        console.log(req.file.path + " was deleted.");
      }
    } else if (configs.mustUpload) {
      req.customErrors.set(configs.requestFieldName, "Image not uploaded.");
    }
    next();
  };
}

module.exports = singleImageUploadValidation;
