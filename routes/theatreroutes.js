const express = require('express');
const router = express.Router();
const theatreController = require('../controllers/theatrecontroller');

router.post('/addTheatre',theatreController.addTheatre);
router.get('/getAllTheatres',theatreController.getAllTheatres);




module.exports = router;