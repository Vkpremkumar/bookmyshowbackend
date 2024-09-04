const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const authToken = authHeader.replace("Bearer ", '').trim();

    if (!authToken) {
        res.status(403).json({ message: `Token is required!...` })
    }

    jwt.verify(authToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(403).json({ message: `Token is invalid!...` })
        }
        console.log("Decoded token :", decoded);
        req.id = decoded.userId;
    })
    if (req.id === req.params.id) {
        next();
    } else {
        res.status(401).json({ message: `Unauthorized user!...` })
    }
}

const verifyTokenAndAdmin = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const authToken = authHeader.replace("Bearer ", '').trim();

    if (!authToken) {
        res.status(403).json({ message: `Token is required!...` })
    }

    jwt.verify(authToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(403).json({ message: `Token is invalid!...` })
        }
        console.log("Decoded token :", decoded);
        req.id = decoded.userId;
        req.username = decoded.username;
        req.role = decoded.role

        if (req.id === req.params.id || req.role === "Admin" || req.role === "Super Admin") {
            next();
        } else {
            res.status(401).json({ message: `Unauthorized user!...` })
        }

    })


}




module.exports = { verifyToken, verifyTokenAndAdmin };