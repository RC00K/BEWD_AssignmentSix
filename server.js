require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const path = require("path");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Custom middleware logger
app.use(logger);
app.use(cors(corsOptions));
// Builtin middleware
app.use(express.urlencoded({ extended: false })); // Used to handle urlencoded data
app.use(express.json()); // Parses incoming requests with JSON payloads
// Public Router
app.use(express.static(path.join(__dirname, "/public")));
// All the routes
app.use("/", require("./routes/root"));
app.use("/states", require("./routes/api/states"));
// All the non-existing paths
app.all("*", (req, res) => {
	res.status(404);
	if (req.accepts("html")) {
		res.sendFile(path.join(__dirname, "view", "404.html"));
	} else if (req.accepts("json")) {
		res.json({ error: "404 not found" });
	} else {
		res.type("txt").send("404 not found");
	}
});

app.use(errorHandler);

//mongoose.connection.once("open", () => {
//	console.log("Connected to MongoDB");
//	app.listen(PORT, () => console.log(`Server running on ${PORT}`));
//});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
