/*--------------------------------------------------
|                🏗️  Importing Modules           |
|--------------------------------------------------*/

const express = require("express");
const app = express();
dotenv = require("dotenv").config();
const colors = require("colors");
const morgan = require("morgan");
const taskRoute = require("./routes/taskRoutes");
const authRoute = require("./routes/authRoute");
/*--------------------------------------------------
|                🎉  End of Imports                    |
|--------------------------------------------------*/

const dbConnection = require("./configs/dbConnection");
dbConnection();
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
	console.log(`mode: ${process.env.NODE_ENV}`.italic.cyan);
}

app.use("/task", taskRoute);
app.use("/user", authRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`.italic.cyan);
});
