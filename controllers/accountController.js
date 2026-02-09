const accountModel = require("../models/account-model")
const utilities = require("../utilities")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver Account view
* *************************************** */
async function buildAccount(req, res, next) {
      console.log(" ########### buildAccount")
  let nav = await utilities.getNav()
  res.render("account/account", {
    title: "Account",
    nav,
    errors: null,
  })
}


/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  
  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration. (HASHPW)')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash("form-success",`Congratulations, you\'re registered ${account_firstname}. Please log in.`)
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("form-fail", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}


/* ****************************************
*  Process Login
* *************************************** */
async function loginAccount(req, res) { // OLD FUNCTION
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body

  const logResult = await accountModel.loginAccount(
    account_email,
    account_password
  )

  console.log(`logResult: ${logResult}`)
  if (logResult) {
    req.flash("form-success",`Login success. Welcome ${logResult.account_firstname}!`)
    res.redirect("/")
    // res.status(201).render("account/login", {
    //   title: "Login",
    //   nav,
    // })
  } else {
    req.flash("form-fail", "Login failed. Wrong email and/or password.")
    res.status(501).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
  }
}

async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
      if(process.env.NODE_ENV === 'development') {
        console.log("DEV")
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        console.log("PROD")
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      console.log("###########")
      console.log("accountLogin: res.cookie('jwt')")

      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error(`Access Forbidden. Exception ${error}`)
  }
}


module.exports = { buildLogin, buildRegister, registerAccount, loginAccount, accountLogin, buildAccount }