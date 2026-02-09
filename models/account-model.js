const { check } = require("express-validator")
const pool = require("../database")
const bcrypt = require("bcryptjs")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    // 'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
    const accounts = await pool.query(sql, [account_email])
    return accounts.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
*   Login
* *************************** */
async function loginAccount(account_email, account_password){
  try {
    console.log(`${account_email} ${account_password}`)
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const result = await pool.query(sql, [account_email])
    console.log(result)

    const match = await bcrypt.compare(account_password, result.rows[0].account_password);

    console.log(`MATCH: ${match}`)
    
    if (match){
      console.log(`SUCCESS!!!`)
      return result.rows[0];
    }else{
      return null;
    }
  } catch (error) {
    return error.message
  }
}


module.exports = { registerAccount, checkExistingEmail, getAccountByEmail, loginAccount };