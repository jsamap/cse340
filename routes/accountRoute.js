// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/index")
const regValidate = require('../utilities/account-validation')
const accountController = require("../controllers/accountController")

router.get("/login", utilities.handleErrors(accountController.buildLogin));

router.get("/register", utilities.handleErrors(accountController.buildRegister));


// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login data
router.post("/login", utilities.handleErrors(accountController.loginAccount)
)

module.exports = router;
