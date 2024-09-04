
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Theatre = require('../models/theatremodel');
const Movie = require('../models/moviemodel');

const Showtime = sequelize.define('Showtime', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    movie_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: Movie,  // This references the movies table
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    theatre_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: Theatre,  // This references the theatres table
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    show_time: {
        type: DataTypes.DATE,
        allowNull: false,
    }
}, {
    tableName: 'showtimes',  //  specify the table name
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

Movie.hasMany(Showtime, { foreignKey: 'movie_id', onDelete: 'CASCADE' });
Theatre.hasMany(Showtime, { foreignKey: 'theatre_id', onDelete: 'CASCADE' });
Showtime.belongsTo(Movie, { foreignKey: 'movie_id', onDelete: 'CASCADE' });
Showtime.belongsTo(Theatre, { foreignKey: 'theatre_id', onDelete: 'CASCADE' });

module.exports = Showtime;
