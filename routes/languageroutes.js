const express = require('express');
const router = express.Router();
const languageController = require('../controllers/languagecontroller');
const { verifyTokenAndAdmin } = require('../middleware/verifyToken');

router.post('/addLanguage', verifyTokenAndAdmin, languageController.addLanguage);
router.get('/getAllLanguages', languageController.getAllLanguages);


module.exports = router;