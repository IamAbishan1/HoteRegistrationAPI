const { validationResult } = require("express-validator")

const handleValidationErrors = function() {
    return function(req, res, next) {
        const errors = validationResult(req);
        let allErrors = req.customErrors.all;
        if (!errors.isEmpty()) {
            errors.errors.forEach(function(err) {
                allErrors[err.param] = err.msg;
            });
        }
        if (Object.keys(allErrors).length > 0)
            return res.json({
                status: "fail",
                data: allErrors,
            });
        next();
        
    }
}

module.exports = handleValidationErrors;