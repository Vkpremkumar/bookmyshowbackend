const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const City = require('../models/citymodel');

const Theatre = sequelize.define('Theatre', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    theatre_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    total_seats:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    available_seats:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    city_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: City, // This references the City model
            key: 'id',
        },
        onDelete: 'CASCADE', // Optionally handle delete behavior
    },
}, {
    tableName: 'theatres',  // Explicitly specify the table name
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'       
});

City.hasMany(Theatre, { foreignKey: 'city_id' });
Theatre.belongsTo(City, { foreignKey: 'city_id' });


module.exports = Theatre;
