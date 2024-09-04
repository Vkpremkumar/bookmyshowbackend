const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // assuming we have a configured sequelize instance
const State = require('./statemodel'); // importing the District model

const City = sequelize.define('City', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    city_code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    city_value: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    state_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: State, // This references the District model
            key: 'id',
        },
        onDelete: 'CASCADE', // Optionally handle delete behavior
    }
}, {
    tableName: 'city', //  specifying the table name
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Define the relationship between District and City
State.hasMany(City, { foreignKey: 'state_id' });
City.belongsTo(State, { foreignKey: 'state_id' });

module.exports = City;
