const express = require('express');
const router = express.Router();
const theatreController = require('../controllers/theatrecontroller');
const { verifyTokenAndAdmin } = require('../middleware/verifyToken');

router.post('/addTheatre', verifyTokenAndAdmin, theatreController.addTheatre);
router.get('/getAllTheatres', theatreController.getAllTheatres);




module.exports = router;