const stateInfo = require("../model/states.json");

const verifyStateExists = (req, res) => {
    // Parameters received in uppercase
    const state = stateInfo.find(
        (st) => st.code === req.params.state.toUpperCase()
    );
    if(!state) {
        return res.status(400).json({ message: `State abbreviation is not valid` });
    }
    return state;
}

module.exports = verifyStateExists;