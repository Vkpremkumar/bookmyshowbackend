require('dotenv').config();


const mysql = require('mysql2');
const { Sequelize } = require('sequelize');

// Create a new instance of Sequelize with your database credentials
const sequelize = new Sequelize( process.env.PROD_DATABASE,process.env.PROD_USER, process.env.PROD_PASSWORD, {
    host: process.env.PROD_HOST,
    dialect: process.env.PROD_DIALECT,
    port: process.env.PROD_PORT
});

const db = mysql.createConnection({
    host: process.env.PROD_HOST,
    user: process.env.PROD_USER,
    password: process.env.PROD_PASSWORD,
    database: process.env.PROD_DATABASE,
    port: process.env.PROD_PORT,
    // connectTimeout: 10000
})



db.connect(function (err, res) {
    if (err) {
        console.log("Error while connecting DB!...", err)
    } else {
        console.log("DB Connected successful...")
    }
})

// module.exports = db;

module.exports = { sequelize, db };