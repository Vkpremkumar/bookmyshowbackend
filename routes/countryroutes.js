const express = require('express');
const router = express.Router();
const countryController = require('../controllers/countrycontroller');
const { verifyTokenAndAdmin } = require('../middleware/verifyToken');


router.post('/addCountry', verifyTokenAndAdmin, countryController.addCountry);
router.get('/getAllCountry', countryController.getAllCountry);

module.exports = router;