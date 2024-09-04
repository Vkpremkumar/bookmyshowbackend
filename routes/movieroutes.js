const express = require('express');
const router = express.Router();
const movieController = require('../controllers/moviecontroller');
const upload = require('../middleware/upload');
const { verifyTokenAndAdmin } = require('../middleware/verifyToken');


router.post('/addMovieWithLanguages', upload.single('image'), verifyTokenAndAdmin, movieController.addMovieWithLanguages);
router.get('/getAllMovies',movieController.getAllMovies);





module.exports = router;