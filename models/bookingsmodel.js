const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('../models/usermodel');
const ShowTime = require('../models/showtimemodel');
const Theatre = require('../models/theatremodel')

const Booking = sequelize.define('Booking', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
    },
    showtime_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
            model: 'showtimes',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
    },
    seats: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    booking_time: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
    },
}, {
    tableName: 'bookings',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});


User.hasMany(Booking, { foreignKey: 'user_id', onDelete: 'CASCADE' });
ShowTime.hasMany(Booking, { foreignKey: 'showtime_id', onDelete: 'CASCADE' });
// Theatre.hasMany(Booking, { foreignKey: 'theatre_id', onDelete: 'CASCADE' });
Booking.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Booking.belongsTo(ShowTime, { foreignKey: 'showtime_id', onDelete: 'CASCADE' });
// Booking.belongsTo(Theatre, { foreignKey: 'theatre_id', onDelete: 'CASCADE' });

module.exports = Booking;
