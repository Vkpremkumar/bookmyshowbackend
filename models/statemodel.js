const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Country = require('./countrymodel'); // importing the Country model

const State = sequelize.define('State', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    state_code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    state_value: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    country_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: Country, // This references the Country model
            key: 'id',
        },
        onDelete: 'CASCADE', // Optionally handle delete behavior
    }
}, {
    tableName: 'state', // explicitly specifying the table name
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'   // disable timestamps if not needed
});

Country.hasMany(State, { foreignKey: 'country_id' });
State.belongsTo(Country, { foreignKey: 'country_id' });

module.exports = State;
