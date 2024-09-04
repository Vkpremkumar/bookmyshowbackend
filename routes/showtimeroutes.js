const express = require('express');
const router = express.Router();
const showTimeController = require('../controllers/showtimecontroller');
const { verifyTokenAndAdmin } = require('../middleware/verifyToken');

router.post('/addShowTime', verifyTokenAndAdmin, showTimeController.addShowTime);
router.get('/getAllShows', showTimeController.getAllShows);



module.exports = router;
