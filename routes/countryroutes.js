const express = require('express');
const router = express.Router();
const countryController = require('../controllers/countrycontroller');


router.post('/addCountry', countryController.addCountry);
router.get('/getAllCountry', countryController.getAllCountry);

module.exports = router;