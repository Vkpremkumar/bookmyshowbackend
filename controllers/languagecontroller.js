const express = require('express');
const router = express.Router();
const Language = require('../models/languagemodel');


const addLanguage = (req, res) => {
    const { language_code, language_value } = req.body;

    // Field validation
    if (!language_code || !language_value) {
        return res.status(400).json({ message: `Please fill all the required fields!...` });
    }

    // Verify if the language already exists
    Language.findOne({ where: { language_code } })
        .then(existsLanguage => {
            if (existsLanguage) {
                return res.status(400).json({ message: `Language already exists!...` });
            }

            // Create and save new language
            return Language.create({
                language_code,
                language_value
            });
        })
        .then(savedLanguage => {
            return res.status(201).json({ Language: savedLanguage, message: `Language added successfully...` });
        })
        .catch(err => {
            return res.status(500).json({ message: `Server error: ${err.message}` });
        });
};

const getAllLanguages = (req, res) => {
    const limit = parseInt(req.query.limit) || 10; // setting the limit 
    const cityName = req.query.City || ''    // city selected in filter

    const queryOptions = {
        order: [['id', 'desc']],
        limit: limit
    }

    Language.findAll(queryOptions)
        .then(languages => {
            if (languages.length === 0) {
                return res.status(404).json({ message: 'No theatres found!' });
            }
            return res.status(200).json(languages);
        })
        .catch(err => {
            return res.status(500).json({ message: `Server error: ${err.message}` });
        });
};





module.exports = { addLanguage, getAllLanguages };



