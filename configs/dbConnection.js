const mongoose = require("mongoose");
const URI = process.env.DB_URI;

const dbConnection = () => {
	mongoose
		.connect(URI)
		.then((conn) => {
			console.log(`Database Connected: ${conn.connection.host}`.italic.yellow);
		})
		.catch((err) => {
			console.log(`Error : ${err}`.italic.red);
			process.exit(1);
		});
};
module.exports = dbConnection;
