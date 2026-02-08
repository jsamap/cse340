const { name } = require("ejs");
const utilities = require(".");
const invModel = require("../models/inventory-model")
const { body, validationResult } = require("express-validator");
const validation = {};


/*  **********************************
 *  Add Classification | Validations
 * ********************************* */
validation.addClassificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty()
      .withMessage("A valid classification name is required.")
      .custom(async (classification_name) => {
          const nameExists = await invModel.checkExistingClassification(classification_name)
          
          if (nameExists){
            throw new Error("Classification already exists, please try again with another name.")
          }
      })
  ];
};
validation.checkAddData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  console.log(errors)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add a new vehicle classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}


module.exports = validation