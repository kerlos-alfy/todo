const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const { updateUser, getAllUsers } = require("../controllers/userController");
const { verifyToken, checkAdmin } = require("../middleware/verifyToken");
const { getForgetPasswordView, sendForgetPasswordLink, getResetPasswordView, resetThePassword } = require("../controllers/passwordController");

router.route("/register").post(register);

router.route("/login").post(login);
router.route("/:id").patch(verifyToken, updateUser);
router.route("/").get(checkAdmin, getAllUsers);
router.route("/passwords").get(getForgetPasswordView).post(sendForgetPasswordLink);
router.route("/passwords/:userId/:token").get(getResetPasswordView).post(resetThePassword);

module.exports = router;
