const express = require('express');
const router = express.Router();
const Movie = require('../models/moviemodel');
const Language = require('../models/languagemodel');
const MovieLanguage = require('../models/movielanguagemodel');
const { sequelize } = require('../config/database');
const moment = require('moment');
const { QueryTypes } = require('sequelize');



// add movie with languages

const addMovieWithLanguages = async (req, res) => {
    console.log("request body:", req.body);

    const { title, description, duration, release_date, languages } = req.body;

    if (!title || !description || !duration || !release_date || !languages) {
        return res.status(400).json({ message: `Please fill all the required fields including languages!...` });
    }

    const formattedReleaseDate = moment(release_date, 'DD-MM-YYYY').format('YYYY-MM-DD');

    try {
        const newMovie = await sequelize.transaction(async (t) => {
            // Create a new movie entry
            const movie = await Movie.create({
                title,
                description,
                duration,
                release_date: formattedReleaseDate,
                image: req.file ? req.file.path : null,
            }, { transaction: t });

            // Parse the languages field, which is expected to be a string like '[1,2,4]'
            const languageIds = JSON.parse(languages);

            // Validate that languageIds is an array and contains valid IDs
            if (!Array.isArray(languageIds) || languageIds.length === 0) {
                throw new Error("Invalid languages provided.");
            }

            // Insert into MovieLanguage table for each language ID provided in the request
            for (let langId of languageIds) {
                await MovieLanguage.create({
                    movie_id: movie.id,
                    language_id: langId
                }, { transaction: t });
            }

            return movie;
        });

        return res.status(201).json({ message: `Movie added successfully...`, Movie: newMovie });

    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ message: `Server error: ${err.message}` });
    }
}

// get all movies with languages

const getAllMovies = async (req, res) => {



    const limit = parseInt(req.query.limit) || 10;
    const { language } = req.query; // get the language filter from query param
    console.log("req.query :", req.query);
    console.log("language :", language);
    try {

        let movies;
        if (language) {

            const [results, metadata] = await sequelize.query(`
                SELECT m.*
                FROM movies m
                INNER JOIN movie_language ml ON m.id = ml.movie_id
                INNER JOIN languages l ON ml.language_id = l.id
                WHERE l.language_value = :language
                LIMIT :limit
            `, {
                replacements: { language: language, limit: 10 },
                type: QueryTypes.SELECT
            });
            
            if (results.length === 0) {
                return res.status(404).json({ message: `No movies found for the language '${language}'!` });
            }

            movies = results;
        } else {
            // If no language is specified, return all movies
            movies = await Movie.findAll({
                order: [['id', 'desc']],
                limit: limit,
                // include: [{
                //     model: Language,
                //     as: 'Languages',
                //     through: { attributes: [] }
                // }]
            });
        }

        return res.status(200).json({ Movies: movies, message: `Movies fetched successfully...` });
    } catch (err) {
        return res.status(500).json({ message: `Server error: ${err.message}` });
    }
}











module.exports = { addMovieWithLanguages, getAllMovies };