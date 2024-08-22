const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: false,
	},
	dueDate: {
		type: Date,
		required: false,
	},
	priority: {
		type: Number,
		required: true,
		min: 1,
		max: 3,
	},
	completed: {
		type: Boolean,
		default: false,
	},
});

module.exports = mongoose.model("Task", taskSchema);
