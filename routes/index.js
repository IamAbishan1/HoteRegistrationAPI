const express = require("express");
const router = express.Router();

router.use("/users", require("./user"));
router.use("/hotel", require("./hotel"));


module.exports = router;