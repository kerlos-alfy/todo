const Task = require("../models/taskModel");

// @desc    Create category
// @route   POST  /api/v1/categories
// @access  Private
exports.createTask = async (req, res) => {
	const { name, description, dueDate, priority, completed } = req.body;
	const newTask = await new Task({ name, description, dueDate, priority, completed });
	newTask.save();
	res.json(newTask);
};

exports.getAllTasks = async (req, res) => {
	const page = req.query.page * 1 || 1;
	const limit = req.query.limit * 1 || 20;
	const skip = (page - 1) * limit;

	const Tasks = await Task.find({}).skip(skip).limit(limit);
	res.json({ results: Tasks.length, page, data: Tasks });
};

exports.getTaskById = async (req, res) => {
	const task = await Task.findById(req.params.id);
	if (!task) {
		return res.status(404).json({ message: "Task not found" });
	}
	res.json(task);
};
exports.updateTaskById = async (req, res) => {
	const { id } = req.params;
	const { name, description, dueDate, priority, completed } = req.body;
	const task = await Task.findOneAndUpdate({ _id: id }, { name, description, dueDate, priority, completed }, { new: true });
	if (!task) {
		return res.status(404).json({ message: "Task not found" });
	}

	res.json(task);
};
exports.deleteTaskById = async (req, res) => {
	const { id } = req.params;
	const task = await Task.findOneAndDelete({ _id: id });
	if (!task) {
		return res.status(404).json({ message: "Task not found" });
	}

	res.json(task);
};
