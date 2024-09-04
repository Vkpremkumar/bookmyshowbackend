const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingcontroller');

router.post('/addBooking', bookingController.addBooking);
router.get('/getAllBookings', bookingController.getAllBookings);
router.delete('/cancelBooking', bookingController.cancelBooking);


module.exports = router;