const express = require('express');
const router = express.Router();
const User = require('../models/usermodel');
const { verifyTokenAndAdmin, verifyToken } = require('../middleware/verifyToken');

// Update user
const updateUser = (verifyTokenAndAdmin, async (req, res) => {
    try {
        // Hash the password if provided on update
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        // Find and update the user details
        const [updatedRows] = await User.update(req.body, {
            where: { id: req.params.id }
        });

        // If no rows were updated, the user was not found
        if (updatedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch the updated user details
        const updatedUser = await User.findOne({ where: { id: req.params.id } });

        return res.status(200).json({
            message: "User updated successfully...",
            updatedUser
        });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
});


// get user by id

const getUserById = (async (req, res) => {
    try {
        const existUser = await User.findOne({ where: { id: req.params.id } })
        return res.status(200).json(existUser);

    } catch (err) {
        return res.status(404).json({ message: `User not found!...` })
    }
});

// Delete user by ID
const deleteUser = (verifyToken, async (req, res) => {
    try {
        const result = await User.destroy({
            where: { id: req.params.id }
        });

        // If no rows were affected, the user was not found
        if (result === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User deleted successfully..." });

    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
});

// get all users
const getAllUsers = (verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    const limit = parseInt(req.query.limit) || 10;
    try {

        if (isNaN(limit) || limit <= 0) {
            res.status(400).json({ message: `Invalid limit parameter...` })
        }
        const options = {
            order: [['id', 'desc']],
            limit: query ? limit : undefined
        }
        const allUser = await User.findAll(options);
        return res.status(200).json({ allUser, message: `Users fetched successfully...` })
    } catch (err) {
        return res.status(404).json({ message: `User not found!...` })
    }

});






module.exports = {
    updateUser,
    getUserById, deleteUser, getAllUsers
};