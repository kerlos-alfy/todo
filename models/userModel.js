const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	userName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
		min: 5,
		max: 30,
	},
	role: {
		type: Boolean,
		default: false,
	},
});

module.exports = mongoose.model("User", userSchema);
