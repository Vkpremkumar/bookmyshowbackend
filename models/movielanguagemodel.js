const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Movie = require('../models/moviemodel');
const Language = require('../models/languagemodel');

const MovieLanguage = sequelize.define('MovieLanguage', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    movie_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: Movie,
            key: 'id',
        },
    },
    language_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: Language,
            key: 'id',
        },
    },
}, {
    tableName: 'movie_language', // Ensure this matches your table name
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = MovieLanguage;
