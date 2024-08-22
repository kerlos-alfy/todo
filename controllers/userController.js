const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

/**
 * @desc Update a user
 * @route PUT /user/:id
 * @access private administrative
 * @param {String}
 * @method patch
 */

exports.updateUser = asyncHandler(async (req, res) => {
	if (req.user.id !== req.params.id) {
		return res.status(403).json({ msg: "You are not allowed" });
	}

	if (req.body.password) {
		const hashedPassword = await bcrypt.hash(req.body.password, 12);
		req.body.password = hashedPassword;
	}

	const userUpdate = await User.findByIdAndUpdate(
		req.params.id,
		{
			$set: {
				email: req.body.email,
				userName: req.body.userName,
				password: req.body.password,
			},
		},
		{
			new: true,
			runValidators: true,
		}
	);
	if (!userUpdate) {
		return res.status(404).json({ msg: "User not found" });
	}
	res.status(200).json({ userUpdate });
});
exports.getAllUsers = asyncHandler(async (req, res) => {
	const page = req.query.page * 1 || 1;
	const limit = req.query.limit * 1 || 20;
	const skip = (page - 1) * limit;
	const users = await User.find({}).skip(skip).limit(limit);
	res.json({ results: users.length, page, data: users });
});
