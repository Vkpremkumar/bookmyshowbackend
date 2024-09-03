const express = require('express');
const router = express.Router();
const State = require('../models/statemodel');
const Country = require('../models/countrymodel');




// const getCountryCode = async (req,res)=>{
//     const {country_code}=req.body;
//     try{
//         const countryExists = await Country.findOne({ where:{country_code}});

//         if (!countryExists) {
//             return res.status(404).json({ message: 'Country not found!' });
//         }

//         // If found, return the country details
//         return res.status(200).json({ country: countryExists });

//     }catch(err){
//         return res.status(400).json({message:err.message});
//     }
// }

const addState = async (req, res) => {
    const { state_code, state_value, country_id } = req.body;

    try {
        // Field validation
        if (!state_code || !state_value || !country_id) {
            return res.status(400).json({ message: 'Please fill all the required fields!...' });
        }

        // Check if the state already exists
        const existState = await State.findOne({ where: { state_code } });
        if (existState) {
            return res.status(400).json({ message: 'State already exists!...' });
        }

        // Check if the associated country exists
        const countryExists = await Country.findByPk(country_id);
        // const countryExists = await Country.getCountryCode({where:{country_code}});
        console.log("Country details : ", countryExists)
        if (!countryExists) {
            return res.status(400).json({ message: 'Invalid country ID!...' });
        }

        // Create and save the new state
        const savedState = await State.create({
            state_code,
            state_value,
            country_id
        });

        return res.status(200).json({ message: 'State added successfully...', state: savedState });

    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

const getAllState = async (req, res) => {
    const query = req.query.new;
    const limit = parseInt(req.query.limit) || 10;
    try {

        if (isNaN(limit) || limit <= 0) {
            res.status(400).json({ message: `Invalid limit parameter...` })
        }
        const options = {
            order: [['id', 'desc']],
            limit: limit,
            include: [
                {
                    model: Country, // include  country model 
                    as: 'Country', // Alias the relation if needed
                    // attributes:['country_code','country_value']   // Specify the fields needed from country model 
                }
            ]
        }
        const allState = await State.findAll(options);
        return res.status(200).json({ allState, message: `State fetched successfully...` })
    } catch (err) {
        return res.status(404).json({ message: `State not found!...` })
    }

};

// Export the method
module.exports = { addState, getAllState };
