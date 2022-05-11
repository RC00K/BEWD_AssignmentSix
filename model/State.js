const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// State Scheme
const stateSchema = new Schema({
	// State Code
	stateCode: {
		type: String,
		required: true,
		unique: true,
	},
	// Fun Facts
	funfacts: {
		type: [String]
	}
});

module.exports = mongoose.model("State", stateSchema);