// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/index")
const validation = require('../utilities/add-validation')

router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

router.get("/detail/:invId", utilities.handleErrors(invController.buildDetailByInvId));


router.get("/", utilities.handleErrors(invController.buildManagement));

router.get("/classification", utilities.handleErrors(invController.buildAddClassification));
router.get("/inventory", utilities.handleErrors(invController.buildAddInventory));


router.post("/classification",
    validation.addClassificationRules(),
    validation.checkAddData,
    utilities.handleErrors(invController.addClassification),
);
router.post("/inventory",
    //validation.addClassificationRules(),
    //validation.checkAddData,
    utilities.handleErrors(invController.addInventory),
);

module.exports = router;
