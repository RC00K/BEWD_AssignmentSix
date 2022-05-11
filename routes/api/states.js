const express = require("express");
const router = express();
const stateController = require("../../controllers/statesController");

// Default Route
router.route("/").get(stateController.getStates);
// State Routes
router.route("/:state").get(stateController.getState);
// State Fun Fact
router.route("/:state/funfact")
  .get(stateController.getFunFact)
  .post(stateController.createNewFact)
  .patch(stateController.updateFact)
  .delete(stateController.deleteFact);
// State Capital
router.route("/:state/capital").get(stateController.getCapital);
// State Nickname
router.route("/:state/nickname").get(stateController.getNickname);
// State Population
router.route("/:state/population").get(stateController.getPopulation);
// State Admission
router.route("/:state/admission").get(stateController.getAdmission);

module.exports = router;