// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/index")
const validation = require('../utilities/inventory-validation')

router.get("/", utilities.checkLogin, utilities.checkIfAdminOrEmployee, utilities.handleErrors(invController.buildManagement));

router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:invId", utilities.handleErrors(invController.buildDetailByInvId));

// Display Management views
router.get("/classification", utilities.checkLogin, utilities.checkIfAdminOrEmployee, utilities.handleErrors(invController.buildAddClassification));
router.get("/update-classification/:classId", utilities.checkLogin, utilities.checkIfAdminOrEmployee, utilities.handleErrors(invController.buildUpdateClassification));
router.get("/inventory", utilities.checkLogin, utilities.checkIfAdminOrEmployee, utilities.handleErrors(invController.buildAddInventory));
router.get("/edit/:invId", utilities.checkLogin, utilities.checkIfAdminOrEmployee, utilities.handleErrors(invController.buildUpdateInventory));
router.get("/delete/:invId", utilities.checkLogin, utilities.checkIfAdminOrEmployee, utilities.handleErrors(invController.buildDeleteInventory));

// Get inventory by classification_id (used in inventory.js to fectch data and display it in the inventory table)
router.get("/getInventory/:classification_id", utilities.checkLogin, utilities.checkIfAdminOrEmployee, utilities.handleErrors(invController.getInventoryJSON))

router.get("/getClassifications/", utilities.checkLogin, utilities.checkIfAdminOrEmployee, utilities.handleErrors(invController.getClassificationsJSON))

// Management: Process Data (Add / Update)
router.post("/classification",
    utilities.checkLogin, 
    utilities.checkIfAdminOrEmployee,
    validation.addClassificationRules(),
    validation.checkAddData,
    utilities.handleErrors(invController.addClassification),
)
router.post("/update-classification/", 
    utilities.checkLogin, 
    utilities.checkIfAdminOrEmployee,
    validation.updateClassificationRules(),
    validation.checkUpdateClassificationData,
    utilities.handleErrors(invController.updateClassification),
)
router.post("/inventory",
    utilities.checkLogin, 
    utilities.checkIfAdminOrEmployee,
    validation.addInventoryRules(),
    validation.checkAddInventoryData,
    utilities.handleErrors(invController.addInventory),
)
router.post("/update/", 
    utilities.checkLogin, 
    utilities.checkIfAdminOrEmployee,
    validation.updateInventoryRules(),
    validation.checkUpdateInventoryData,
    utilities.handleErrors(invController.updateInventory),
)
router.post("/delete/", 
    utilities.checkLogin, 
    utilities.checkIfAdminOrEmployee,
    utilities.handleErrors(invController.deleteInventory),
)


module.exports = router;
