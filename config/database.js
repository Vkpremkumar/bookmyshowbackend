

const mysql = require('mysql2');
const { Sequelize } = require('sequelize');

// Create a new instance of Sequelize with your database credentials
const sequelize = new Sequelize('bookmyshow', 'avnadmin', 'AVNS_hhAH0VDmpD7t85Asd3X', {
    host: 'mysql-282cdbaf-vikramprem93-bdce.i.aivencloud.com',
    dialect: 'mysql',
    port: 21233
});

const db = mysql.createConnection({
    host: "mysql-282cdbaf-vikramprem93-bdce.i.aivencloud.com",
    user: "avnadmin",
    password: "AVNS_hhAH0VDmpD7t85Asd3X",
    database: "bookmyshow",
    port: 21233,
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