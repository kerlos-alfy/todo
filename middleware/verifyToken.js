const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

exports.verifyToken = asyncHandler(async (req, res, next) => {
	const token = req.header("Authorization")?.split(" ")[1];

	if (!token) {
		return res.status(401).json({ message: "Access denied. No token provided." });
	}

	try {
		const decoded = jwt.verify(token, process.env.SECRET_KEY);
		req.user = decoded;
		next();
	} catch (err) {
		if (err.name === "TokenExpiredError") {
			return res.status(401).json({ message: "Token expired." });
		} else if (err.name === "JsonWebTokenError") {
			return res.status(401).json({ message: "Invalid token." });
		} else {
			return res.status(500).json({ message: "Failed to authenticate token." });
		}
	}
});

exports.checkAdmin = asyncHandler(async (req, res, next) => {
	const token = req.header("Authorization")?.split(" ")[1];
	if (!token) {
		return res.status(401).json({ message: "Access denied. No token provided." });
	}

	try {
		const decoded = jwt.verify(token, process.env.SECRET_KEY);
		req.user = decoded;
		if (req.user.role) {
			next();
		} else {
			res.status(403).json({ message: "Access denied. You do not have admin privileges." });
		}
	} catch (err) {
		if (err.name === "TokenExpiredError") {
			return res.status(401).json({ message: "Token expired." });
		} else if (err.name === "JsonWebTokenError") {
			return res.status(401).json({ message: "Invalid token." });
		} else {
			return res.status(500).json({ message: "Failed to authenticate token." });
		}
	}
});
