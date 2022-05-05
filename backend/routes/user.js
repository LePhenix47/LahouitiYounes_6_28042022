const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const password = require("../middleware/password-validator");

router.post("/signup", password, userController.signup);
router.post("/login", userController.login);

module.exports = router;