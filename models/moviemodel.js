const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Language = require('../models/languagemodel');
const MovieLanguage = require('../models/movielanguagemodel')


const Movie = sequelize.define('Movie', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    duration: {
        type: DataTypes.INTEGER,
    },
    release_date: {
        type: DataTypes.DATE,
    },
    image:{
        type:DataTypes.STRING
    }
}, {
    tableName: 'movies',  // Specify the table name if necessary
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});



// Movie.belongsToMany(Language, {
//     through: MovieLanguage,  // Sequelize will automatically create this join table
//     foreignKey: 'movie_id',
//     onDelete: 'CASCADE'
// });



Movie.associate = (models) => {
    Movie.belongsToMany(models.Language, {
        through: models.MovieLanguage,
        foreignKey: 'movie_id',
        onDelete: 'CASCADE'
    });
};


module.exports = Movie;