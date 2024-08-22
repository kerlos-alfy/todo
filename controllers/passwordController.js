const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
exports.getForgetPasswordView = asyncHandler((req, res) => {
	res.render("forgot-password");
});

module.exports.sendForgetPasswordLink = asyncHandler(async (req, res) => {
	const user = await User.findOne({ email: req.body.email });

	if (!user) {
		return console.log("User not found");
	}
	const secret = process.env.JWT_SECRET + user.password;
	const token = jwt.sign({ email: user.email, id: user._id }, secret, { expiresIn: "1h" });
	const link = `http://localhost:3000/user/passwords/${user._id}/${token}`;
	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});
	const mailOptions = {
		form: process.env.EMAIL_USER,
		to: user.email,
		subject: "Reset Password",
		html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h4 {
            color: #333333;
            font-size: 18px;
        }
        p {
            font-size: 16px;
            color: #555555;
        }
        .link-button {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 20px;
            font-size: 16px;
            color: #ffffff;
            background-color: #0073aa;
            text-decoration: none;
            border-radius: 4px;
        }
        .link-button:hover {
            background-color: #005f8a;
        }
    </style>
</head>
<body>
    <div class="container">
        <h4>Click on the link below to reset your password:</h4>
        <p><a href="${link}" class="link-button">Reset Password</a></p>
    </div>
</body>
</html>`,
	};
	transporter.sendMail(mailOptions, (error, success) => {
		if (error) {
			console.log(error);
		} else {
			console.log("Email sent:" + success.response);
		}
	});
	res.render("link-send");
});

/**
 *  @desc    Get Reset Password Link
 *  @route   /password/forgot-password
 *  @method  GET
 *  @access  public
 */

module.exports.getResetPasswordView = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.userId);

	if (!user) {
		return console.log("User not found");
	}
	const secret = process.env.JWT_SECRET + user.password;
	try {
		jwt.verify(req.params.token, secret);
		res.render("reset-password", { email: user.email });
	} catch (err) {
		console.log(err);
		res.json({ message: err.message });
	}
});

/**
 *  @desc    Reset Password
 *  @route   /password/forgot-password
 *  @method  GET
 *  @access  public
 */

module.exports.resetThePassword = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.userId);

	if (!user) {
		return console.log("User not found");
	}
	const secret = process.env.JWT_SECRET + user.password;
	try {
		jwt.verify(req.params.token, secret);
		const salt = await bcrypt.genSalt(10);
		req.body.password = await bcrypt.hash(req.body.password, salt);
		user.password = req.body.password;
		await user.save();
		res.render("success-password");
	} catch (err) {
		console.log(err);
		res.json({ message: err.message });
	}
});
