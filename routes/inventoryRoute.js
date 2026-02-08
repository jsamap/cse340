// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/index")

router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

router.get("/detail/:invId", utilities.handleErrors(invController.buildDetailByInvId));


router.get("/", utilities.handleErrors(invController.buildManagement));

router.get("/classification", utilities.handleErrors(invController.buildAddClassification));
router.get("/inventory", utilities.handleErrors(invController.buildAddInventory));


router.post("/:table", utilities.handleErrors(invController.buildManagement));

module.exports = router;
