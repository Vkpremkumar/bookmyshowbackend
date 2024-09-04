const express = require('express');
const router = express.Router();
const City = require('../models/citymodel');
const State = require('../models/statemodel');

const addCity = async (req, res) => {
    const { city_code, city_value, state_id } = req.body;

    try {
        // field validation
        if (!city_code || !city_value || !state_id) {
            return res.status(400).json({ message: `Please fill all the required fields!...` })
        }

        // verify city already exists
        const existCity = await City.findOne({ where: { city_code } });
        if (existCity) {
            return res.status(400).json({ message: 'City already exists!...' });
        }

        // verify district code
        const stateExists = await State.findByPk(state_id);
        if (!stateExists) {
            return res.status(400).json({ message: `Invalid State ID!...` });
        }

        // create and save the new city
        const savedCity = await City.create({
            city_code,
            city_value,
            state_id
        })

        return res.status(200).json({ City: savedCity, message: `City added successfully...` })

    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}



const getAllCity = async (req, res) => {

    const query = req.query.new;
    const limit = parseInt(req.query.limit) || 10;

    try {
        if (isNaN(limit) || limit <= 0) {
            return res.status(400).json({ message: `Invalid limit parameter!...` })
        }
        const options = {
            order: [['id', 'desc']],
            limit: limit,
            include: [
                {
                    model: State, // include  state model 
                    as: 'State', // Alias the relation if needed                     
                }
            ]
        }
        const allCity = await City.findAll(options);
        return res.status(200).json({ allCity, message: `City fetched successfully...` })
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}



module.exports = { addCity, getAllCity }
