const express = require('express');
const router = express.Router();
const cityController = require('../controllers/citycontroller');
const { verifyTokenAndAdmin, verifyToken } = require('../middleware/verifyToken');


router.post('/addCity', verifyTokenAndAdmin, cityController.addCity);
router.get('/getAllCity', cityController.getAllCity);

module.exports = router;