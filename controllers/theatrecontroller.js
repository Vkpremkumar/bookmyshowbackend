const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');

const Theatre = require('../models/theatremodel');
const City = require('../models/citymodel');


const addTheatre = async (req, res) => {
    const { theatre_name, city_id, total_seats, available_seats } = req.body;

    try {
        // Field validation
        if (!theatre_name || !city_id || !total_seats || !available_seats) {
            return res.status(400).json({ message: `Please fill all the required fields!...` });
        }

        // Check if the city exists
        const city = await City.findByPk(city_id);
        if (!city) {
            return res.status(404).json({ message: 'City not found!...' });
        }

        // Check if the theatre already exists
        const existTheatre = await Theatre.findOne({ where: { theatre_name, city_id } });
        if (existTheatre) {
            return res.status(409).json({ message: 'Theatre already exists in this city!...' });
        }

        // Create and save new theatre
        const savedTheatre = await Theatre.create({
            theatre_name,
            city_id,
            total_seats,
            available_seats
        });

        return res.status(201).json({ Theatre: savedTheatre, message: `Theatre saved successfully...` });
    } catch (err) {
        return res.status(500).json({ message: `Server error: ${err.message}` });
    }
};


// get all theatres by city id  by using the promise 

const getAllTheatres = (req, res) => {
    const limit = parseInt(req.query.limit) || 10; // setting the limit 
    const cityName = req.query.City || ''    // city selected in filter


    const queryOptions = {
        include: [{
            model: City,
            as: 'City'  // Ensure this alias matches the one used in the association
        }],
        order: [['id', 'desc']],
        limit: limit
    }

    if (cityName) {
        queryOptions.include[0].where = {
            city_value: {
                [Op.like]: `%${cityName}%`    // verifying the city matches in the city table 
            }
        }
    }
    Theatre.findAll(queryOptions)
        .then(theatres => {
            if (theatres.length === 0) {
                return res.status(404).json({ message: 'No theatres found!' });
            }
            return res.status(200).json(theatres);
        })
        .catch(err => {
            return res.status(500).json({ message: `Server error: ${err.message}` });
        });
};






module.exports = { addTheatre, getAllTheatres }