const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

/* ***************************
 *  Build inventory by classification view
 * ************************** */
async function buildByClassificationId (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}


/* ***************************
 *  Build inventory details view
 * ************************** */
async function buildDetailByInvId (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryDetailsByInvId(inv_id)
  // if (!data || data.length === 0){
  //   const error = new Error(`There are no vehicles with the ID '${inv_id}'.`)
  //   error.status = "404";
  //   throw error;
  // }
  const grid = await utilities.buildInventoryDetailsGrid(data)
  let nav = await utilities.getNav()
  const make = data[0].inv_make
  const model = data[0].inv_model
  const year = data[0].inv_year
  res.render("./inventory/detail", {
    title: make+" "+model+" "+year,
    nav,
    grid,
  })
}


/* ***************************
 *  Build inventory management view
 * ************************** */
async function buildManagement (req, res, next) {
  let nav = await utilities.getNav()
  let content = await utilities.getManagementOptions();
  res.render("inventory/management", {
    title: "Management",
    nav,
    content
  })
}

async function buildAddClassification (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add a new vehicle classification",
    nav,
    errors: null
  })
}

async function buildAddInventory (req, res, next) {
  let nav = await utilities.getNav()
  let classificationDropdown = await utilities.buildClassificationList()

  res.render("inventory/add-inventory", {
    title: "Add a new vehicle to the inventory",
    nav,
    classificationDropdown,
    errors: null
  })
}

async function addClassification (req, res) {
  const { classification_name } = req.body
  const addResult = await invModel.addClassification( classification_name )

  let nav = await utilities.getNav()

  if (addResult) {
    req.flash("form-success",`New classification added: ${classification_name}`)
    // res.redirect("/inv")
    res.status(201).render("./", {
      title: "Management",
      nav,
    })
  } else {
    req.flash("form-fail", "Sorry, failed to add the new classification.")
    res.status(501).render("inventory/add-classification", {
      title: "Add a new classification",
      nav,
      errors: null
    })
  }
}

async function addInventory (req, res) {
  const { inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id } = req.body
  const inv_image = "/images/vehicles/no_image.jpg", inv_thumbnail = "/images/vehicles/no_image-tn.jpg"; 
  const addResult = await invModel.addInventory( inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id )
  let nav = await utilities.getNav()

  console.log(addResult);

  if (addResult) {
    req.flash("form-success",`New vehicle added: ${inv_make} ${inv_model} ${inv_year}`)
    res.status(201).render("./", {
      title: "Management",
      nav,
    })
  } else {
    req.flash("form-fail", "Sorry, failed to add the new classification.")
    res.status(501).render("inventory/add-classification", {
      title: "Add a new vehicle classification",
      nav,
      errors: null
    })
  }
}


module.exports = { buildByClassificationId, buildDetailByInvId, buildManagement, buildAddClassification, buildAddInventory, addClassification, addInventory }