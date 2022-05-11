const { logEvents } = require("./logEvents");

const errorHandler = (err, req, res, next) => {
	// Error name and message
	logEvents(`${err.name}: ${err.message}`, "errorLog.txt");
	// Console Message
	console.error(err.stack);
	res.status(500).send(err.message);
};

module.exports = errorHandler;