const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
exports.register = asyncHandler(async (req, res) => {
	const { email, userName, password, role } = req.body;

	// Validate input
	if (!email || !userName || !password) {
		return res.status(400).json({ msg: "All fields are required" });
	}

	// Check if user already exists
	const isRegister = await User.findOne({ email });
	if (isRegister) {
		return res.status(400).json({ msg: "User already exists" });
	}

	// Hash the password
	const hashedPassword = await bcrypt.hash(password, 12);

	// Create new user
	const user = new User({
		userName,
		email,
		password: hashedPassword,
		role,
	});

	// Save the user
	await user.save();

	// Respond with the created user
	res.status(201).json({ user });
});

exports.login = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	// Validate input
	if (!email || !password) {
		return res.status(400).json({ msg: "All fields are required" });
	}

	// Check if user already exists
	const user = await User.findOne({ email });
	if (!user) {
		return res.status(400).json({ msg: "User is not retested" });
	}
	// Check password
	const isMach = await bcrypt.compare(password, user.password);
	if (!isMach) {
		return res.status(400).json({ msg: "Invalid password" });
	}
	const token = await jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.SECRET_KEY);
	// Respond with the user and token
	return res.status(200).json({ user, token });
});
