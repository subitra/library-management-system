const router = require("express").Router();
const authController = require("../controller/authControl");

//Authentication Routes

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/resetpassword", authController.resetPassword);

module.exports = router;
