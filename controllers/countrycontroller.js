const express = require('express');
const router = express.Router();
const Country = require('../models/countrymodel');
const { verifyTokenAndAdmin, verifyToken } = require('../middleware/verifyToken');




const addCountry = (verifyTokenAndAdmin, async (req, res) => {
    const { country_code, country_value } = req.body;
    try {
        // field validation
        if (!country_code || !country_value) {
            return res.status(400).json({ message: `Please fill all the required fields!...` });
        }

        // check country already exists
        const existCountry = await Country.findOne({ where: { country_code } });
        if (existCountry) {
            return res.status(400).json({ message: `Country Already exists!...` });
        }

        const newCountry = new Country({
            country_code: req.body.country_code,
            country_value: req.body.country_value
        });

        const savedCountry = await newCountry.save();
        return res.status(200).json({ message: `Country added successfully...`, Country: savedCountry });

    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
});


// get all country
const getAllCountry = async (req, res) => {
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
        const allCountry = await Country.findAll(options);
        return res.status(200).json({ allCountry, message: `Countries fetched successfully...` })
    } catch (err) {
        return res.status(404).json({ message: `Country not found!...` })
    }

};


module.exports = { addCountry, getAllCountry };