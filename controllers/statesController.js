const statesVerified = require("../middleware/statesVerified");
const StateDB= require("../model/State");

const stateInfo = {
  states: require("../model/states.json"),
  setState: function(data, index) {
    this.states[index] = data;
  },
};

//Get all States
const getStates = async (req, res) => {
  const states = await StateDB.find();
  if(states) {
    states.forEach((state) => {
      if(state.funfacts) {
        const currentState = stateInfo.states.find(state => state.code === state.stateCode);
        stateInfo.setState({
          ...currentState,
          "funfacts": state.funfacts
        }, stateInfo.states.findIndex((state) => { if(state.code === state.stateCode) return true; }));
      }
    });
  }

  if(req.query.contig) {
    // Non-Contiguous States
    if(req.query.contig.toLowerCase() === "true") {
      const filteredStates = stateInfo.states.filter((state) =>
        state.code !== "AK" && state.code !== "HI"
      );
      return res.json(filteredStates);
      // Contiguous States
    } else if(req.query.contig.toLowerCase() === "false") {
      const filteredStates = stateInfo.states.filter((state) => 
        state.code === "AK" || state.code === "HI"
      );
      return res.json(filteredStates);
    }
  }
  return res.json(stateInfo.states);
}

//Get State
const getState = async (req, res) => {
  const State = statesVerified(req, res);
  if(res.headersSent) {
    return;
  }
  // Find state using state code
  const statesMongoDB = await StateDB.findOne({ stateCode: req.params.state.toUpperCase() }).exec();
  if(statesMongoDB) {
    const mergedState = { ...State, "funfacts": statesMongoDB.funfacts };
    return res.json(mergedState);
  }
  return res.json(State);
}

// Get a Fun Fact
const getFunFact = async (req, res) => {
  const State = statesVerified(req, res);
  if(res.headersSent) {
    return;
  }
  if(!State.funfacts) {
    res.json({ message: `No fun facts found for ${State.state}` });
  } else {
    if(State.funfacts.length == 0) {
      res.json({ message: `Fun facts don't exists for ${State.state}` });
    }
    res.json({ "funfacts": State.funfacts[Math.floor(Math.random() * State.funfacts.length)] });
  }
}

// Get state capital
const getCapital = (req, res) => {
  const State = statesVerified(req, res);
  if(res.headersSent) {
    return;
  }
  // State and Capital
  return res.json({
    "state": State.state,
    "capital": State.capital_city
  });
}

// Get state nickname
const getNickname = (req, res) => {
  const State = statesVerified(req, res);
  if(res.headersSent) {
    return;
  }
  // State and Nickname
  return res.json({
    "state": State.state,
    "nickname": State.nickname
  });
}

// Get state population
const getPopulation = (req, res) => {
  const State = statesVerified(req, res);
  if(res.headersSent) {
    return;
  }
  // State and Population
  return res.json({
    "state": State.state,
    "population": State.population
  });
}

// Get state admission
const getAdmission = (req, res) => {
  const State = statesVerified(req, res);
  if(res.headersSent) {
    return;
  }
  // State and Admission Date
  return res.json({
    "state": State.state,
    "admitted": State.admission_date
  });
}

//Create an Fact
const createNewFact = async (req, res) => {
  const State = statesVerified(req, res);
  if(res.headersSent) {
    return;
  }
  if(!req.body.funfacts || !Array.isArray(req.body.funfacts)) {
    return res.status(400).json({ message: `State fun fact required` });
  }
  const statesMongoDB = await StateDB.findOne({ stateCode: req.params.state.toUpperCase() }).exec();
  const results = await StateDB.findOneAndUpdate(
    { stateCode: req.params.state.toUpperCase() },
    { funfacts: [ ...statesMongoDB ? statesMongoDB.funfacts : [], ...req.body.funfacts ]},
    { new: true, upsert: true }
  );
  return res.status(201).json(results);
}

// Update Fun Fact
const updateFact = async (req, res) => {
  const State = statesVerified(req, res);
  if(res.headersSent) {
    return;
  }
  if(!req?.body.index) {
    return res.status(400).json({ message: `State fun fact index value required` });
  }
  // Fun Fact value was included with request
  if(!req.body.funfact || typeof req.body.funfact !== "string") {
    return res.status(400).json({ message: `State fun fact value required` });
  }
  const statesMongoDB = await StateDB.findOne({ stateCode: req.params.state.toUpperCase() }).exec();
  if(!statesMongoDB) {
    return res.status(404).json({ message: `No fun facts found for ${State.state}` });
  } else if(!statesMongoDB.funfacts[req.body.index-1]) {
    return res.status(404).json({ message: `No fun facts found at the index for ${State.state}` });
  } else {
    statesMongoDB.funfacts[req.body.index-1] = req.body.funfact;
    const results = await StateDB.findOneAndUpdate(
      { stateCode: req.params.state.toUpperCase() },
      { funfacts: statesMongoDB.funfacts },
      { new: true }
    );
    return res.status(201).json(results);
  }
}

// Delete Fun Fact
const deleteFact = async (req, res) => {
  const State = statesVerified(req, res);
  if(res.headersSent) {
    return;
  }
  if(!req.body.index) {
    return res.status(400).json({ message: `State fun fact index value required` });
  }
  const statesMongoDB = await StateDB.findOne({ stateCode: req.params.state.toUpperCase() }).exec();
  // There are no fun facts
  if(!statesMongoDB) {
    return res.status(404).json({ message: `No fun facts found for ${State.state}` });
  } else if(!statesMongoDB.funfacts[req.body.index-1]) {
    return res.status(404).json({ message: `No fun facts found at the index for ${State.state}` });
  } else {
    // 1 is subtracted from index value
    statesMongoDB.funfacts.splice(req.body.index-1, 1);
    const results = await StateDB.findOneAndUpdate(
      { stateCode: req.params.state.toUpperCase() },
      { funfacts: statesMongoDB.funfacts },
      { new: true }
    );
    return res.status(201).json(results);
  }
}

module.exports = {
  getStates,
  getState,
  getFunFact,
  getCapital,
  getNickname,
  getPopulation,
  getAdmission,
  createNewFact,
  updateFact,
  deleteFact
};