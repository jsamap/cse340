// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/index")
const validate = require('../utilities/account-validation')
const accountController = require("../controllers/accountController")


router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccount));

router.get("/login", utilities.handleErrors(accountController.buildLogin));

router.get("/register", utilities.handleErrors(accountController.buildRegister));


// Process the registration data
router.post(
  "/register",
  validate.registationRules(),
  validate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login data
router.post(
  "/login",
  validate.loginRules(),
  validate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

module.exports = router;
