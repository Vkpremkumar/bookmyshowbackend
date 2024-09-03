
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Movie = require('../models/moviemodel');
const MovieLanguage = require('../models/movielanguagemodel');

const Language = sequelize.define('Language', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    language_code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    language_value: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    tableName: 'languages',  //  specifying the table name
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});




// Language.belongsToMany(Movie, {
//     through: MovieLanguage,  // Sequelize will automatically create this join table
//     foreignKey: 'language_id',
//     onDelete: 'CASCADE'
// });


Language.associate = (models) => {
    Language.belongsToMany(models.Movie, {
        through: models.MovieLanguage,
        foreignKey: 'language_id',
        onDelete: 'CASCADE'
    });
};



module.exports = Language;
