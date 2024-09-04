const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

console.log(sequelize)

const Country = sequelize.define('Country', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    country_code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    country_value: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    tableName: 'country', // explicitly specifying the table name
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'     // disable timestamps if not needed
});

module.exports = Country;
