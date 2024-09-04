const express = require('express');
const router = express.Router();
const User = require('../models/usermodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// register api 

const registerUser = async (req, res) => {

    const { username, email, password, mobile_number, role } = req.body;
    try {
        // field validation
        if (!username || !email || !password || !mobile_number || !role) {
            return res.status(400).json({ message: `Please fill all the required fields!...` });
        }

        // check username already exists
        const existUser = await User.findOne({ where: { username } });
        if (existUser) {
            return res.status(400).json({ message: `User Already exists!...` })
        }

        // check email already exists
        const existEmail = await User.findOne({ where: { email } });
        if (existEmail) {
            return res.status(400).json({ message: `Email Already exists!...` })
        }

        // check mobile number already exists
        const existMobile = await User.findOne({ where: { mobile_number } });
        if (existMobile) {
            return res.status(400).json({ message: `Mobile number Already exists!...` })
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = bcrypt.hashSync(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            mobile_number: req.body.mobile_number,  // Ensure this matches your model
            password: hashPassword,
            role: req.body.role
        });

        const savedUser = await newUser.save();

        return res.status(200).json({ savedUser });

    } catch (err) {
        console.error(err);
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Unique constraint error!' });
        } else if (err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation error!', details: err.errors });
        } else if (err.name === 'SequelizeConnectionError') {
            return res.status(500).json({ message: 'Database connection error!' });
        } else {
            // General error
            return res.status(500).json({ message: 'Internal server error!...' });
        }
    }


}

// login api

const userLogin = async (req, res) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            return res.status(400).json({ message: 'Please fill all the required fields!...' });
        }

        // Verify the username
        const user = await User.findOne({ where: { username: username } });

        if (!user) {
            return res.status(404).json({ message: 'User not found!..' });
        }

        // Ensure password is a string and compare
        if (typeof password !== 'string' || typeof user.password !== 'string') {
            return res.status(400).json({ message: 'Invalid password format!' });
        }

        // Verify the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Password does not match!..' });
        }

        // Check JWT_SECRET is set
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'JWT_SECRET is not set!' });
        }

        // Generate jwt if password matched 
        const accessToken = jwt.sign({
            userId: user.id,
            username: user.username,
            role: user.role
        }, process.env.JWT_SECRET, { expiresIn: '1h' });

        console.log(`Token:`, accessToken);

        // Construct the response but exclude the password
        const userResponse = {
            id: user.id,
            username: user.username,
            email: user.email,
            mobile_number: user.mobile_number,
            role: user.role,
            created_at: user.created_at,
            updated_at: user.updated_at
        };


        return res.status(200).json({ User: userResponse, Token: accessToken, message: 'User logged in successfully..' });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error!...' });
    }
}






module.exports = { registerUser, userLogin };