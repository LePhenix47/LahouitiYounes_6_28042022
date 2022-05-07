const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const email = require("../middleware/email-validator");
const password = require("../middleware/password-validator");

router.post("/signup", email, password, userController.signup);
router.post("/login", userController.login);

module.exports = router;