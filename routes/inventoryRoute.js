// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/index")
const validation = require('../utilities/inventory-validation')

router.get("/", utilities.handleErrors(invController.buildManagement));

router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:invId", utilities.handleErrors(invController.buildDetailByInvId));

// Display Management views
router.get("/classification", utilities.handleErrors(invController.buildAddClassification));
router.get("/inventory", utilities.handleErrors(invController.buildAddInventory));
router.get("/edit/:invId", utilities.handleErrors(invController.buildUpdateInventory));

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Management: Process Data (Add / Update)
router.post("/classification",
    validation.addClassificationRules(),
    validation.checkAddData,
    utilities.handleErrors(invController.addClassification),
)
router.post("/inventory",
    validation.addInventoryRules(),
    validation.checkAddInventoryData,
    utilities.handleErrors(invController.addInventory),
)
router.post("/update/", 
    validation.addUpdateRules(),
    validation.checkUpdateInventoryData,
    utilities.handleErrors(invController.updateInventory),
)


module.exports = router;
