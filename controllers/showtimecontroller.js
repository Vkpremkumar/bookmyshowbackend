const express = require('express');
const router = express.Router();
const ShowTime = require('../models/showtimemodel');
const Movie = require('../models/moviemodel');
const Theatre = require('../models/theatremodel');

const moment = require('moment');



const addShowTime = async (req, res) => {
    const { movie_id, theatre_id, show_time } = req.body;

    if (!movie_id || !theatre_id || !show_time) {
        return res.status(400).json({ message: 'Please fill all the required fields!' });
    }

    try {
        // Verify movie_id exists
        const existsMovie = await Movie.findOne({ where: { id: movie_id } });
        if (!existsMovie) {
            return res.status(404).json({ message: 'Movie not found!' });
        }

        // Verify theatre_id exists
        const existsTheatre = await Theatre.findOne({ where: { id: theatre_id } });
        if (!existsTheatre) {
            return res.status(404).json({ message: 'Theatre not found!' });
        }

        // Format show_time
        const formattedShowTime = moment(show_time, 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');

        // Create a new showtime record
        const newShowTime = await ShowTime.create({
            movie_id,
            theatre_id,
            show_time: formattedShowTime
        });

        return res.status(201).json({
            message: 'Showtime added successfully!',
            ShowTime: newShowTime
        });

    } catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ message: `Server error: ${err.message}` });
    }
};


const getAllShows = async (req, res) => {
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
                    model: Movie,
                    as: 'Movie'
                },
                {
                    model: Theatre,
                    as: 'Theatre'
                }
            ]
        }

        const allShows = await ShowTime.findAll(options);

        return res.status(200).json({ Shows: allShows, message: `Shows fetched successfully...` });

    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}


module.exports = { addShowTime, getAllShows };
