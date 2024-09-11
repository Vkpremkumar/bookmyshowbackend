const express = require('express');
const router = express.Router();
const { sequelize } = require('../config/database');
const Booking = require('../models/bookingsmodel');
const User = require('../models/usermodel');
const Showtime = require('../models/showtimemodel');
const Theatre = require('../models/theatremodel');
const Movie = require('../models/moviemodel')
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

dotenv.config();


// Create booking impl starts

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SENDER_EMAIL,           //  sender email details
        pass: process.env.SENDER_MAIL_PASS       //  app-specific password
    }
});


//  send booking confirmation email function
const sendBookingEmail = async (userEmail, bookingDetails) => {
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: userEmail,                   // logged  User's email 
    subject: 'Booking Confirmation',
    text: `Dear Customer,

Thank you for booking with us! Here are your booking details:

Booking ID: ${bookingDetails.id}
Showtime: ${bookingDetails.showtime_id}
Seats: ${bookingDetails.seats}
Total Price: $${bookingDetails.total_price}
Booking Time: ${bookingDetails.booking_time}

We hope you enjoy the show!

Regards,
Book My Show
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Booking confirmation email sent.');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

const addBooking = async (req, res) => {
    debugger
  const { user_id, showtime_id, seats, total_price, booking_time } = req.body;

  if (!user_id || !showtime_id || !seats || !total_price || !booking_time) {
    return res.status(400).json({ message: `Please fill all the required fields!...` });
  }

  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Verifying user_id
    const existUser = await User.findOne({ where: { id: user_id } });
    if (!existUser) {
      await transaction.rollback();
      return res.status(401).json({ message: `User not found!...` });
    }

    // Verifying showtime_id
    const existShowtime = await Showtime.findOne({ where: { id: showtime_id } });
    if (!existShowtime) {
      await transaction.rollback();
      return res.status(401).json({ message: `Showtime not found!...` });
    }

    // Finding the associated theater
    const theatre = await Theatre.findOne({ where: { id: existShowtime.theatre_id } });
    if (!theatre) {
      await transaction.rollback();
      return res.status(404).json({ message: `Theatre not found!...` });
    }

    // Check if there are enough available seats
    if (theatre.available_seats < seats) {
      await transaction.rollback();
      return res.status(400).json({ message: `Not enough available seats!...` });
    }

    // Update the available seats in the theatre
    theatre.available_seats -= seats;
    await theatre.save({ transaction });

    // Create the booking
    const newBooking = await Booking.create({
      user_id,
      showtime_id,
      seats,
      total_price,
      booking_time
    }, { transaction });

    // Commit the transaction
    await transaction.commit();

    // Send the booking confirmation email
    await sendBookingEmail(existUser.email, newBooking); // Sends email to the user's email

    return res.status(201).json({ Booking: newBooking, message: `Ticket Booked Successfully...` });
  } catch (err) {
    // Rollback the transaction in case of an error
    await transaction.rollback();
    return res.status(500).json({ message: `Server error: ${err.message}` });
  }
};




// create booking impl end



// get all booking impl start
const getAllBookings = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    try {
        const options = {
            order: [['id', 'desc']],
            limit: limit,
            include: [{
                model: User,
                as: 'User',
                attributes: ['username', 'email', 'mobile_number', 'role']
            },
            {
                model: Showtime,
                as: 'Showtime',
                attributes: ['movie_id', 'theatre_id', 'show_time'],
                include: [{
                    model: Theatre,
                    as: 'Theatre',
                    attributes: ['theatre_name', 'total_seats', 'available_seats']
                }, {
                    model: Movie,
                    as: 'Movie',
                    attributes: ['title', 'description', 'duration', 'release_date', 'image']
                }]
            }]

        }

        const allBookings = await Booking.findAll(options);

        return res.status(200).json({ Bookings: allBookings, message: `Booking details fetched successfully...` });

    } catch (err) {
        return res.status(500).json({ message: `Server error : ${err.message}` });
    }

}

// get booking list impl end


// cancel booking impl starts
const cancelBooking = async (req, res) => {
    const { booking_id } = req.params; // Assuming booking_id is passed as a URL parameter

    // Start a transaction
    const transaction = await sequelize.transaction();

    try {
        //  Verify that the booking exists
        const existBooking = await Booking.findOne({ where: { id: booking_id }, transaction });

        if (!existBooking) {
            // If the booking does not exist, return a 404 error
            await transaction.rollback();
            return res.status(404).json({ message: `Booking not found!...` });
        }

        //  Get the showtime and the theater associated with the booking
        const showtime = await Showtime.findOne({ where: { id: existBooking.showtime_id }, transaction });
        if (!showtime) {
            await transaction.rollback();
            return res.status(404).json({ message: `Showtime not found!...` });
        }

        const theatre = await Theatre.findOne({ where: { id: showtime.theatre_id }, transaction });
        if (!theatre) {
            await transaction.rollback();
            return res.status(404).json({ message: `Theatre not found!...` });
        }

        //  Update the available seats in the theatre
        theatre.available_seats += existBooking.seats;
        await theatre.save({ transaction });

        //  Delete the booking
        await Booking.destroy({ where: { id: booking_id }, transaction });

        //  Commit the transaction
        await transaction.commit();

        return res.status(200).json({ message: `Booking canceled successfully, and seats updated.` });

    } catch (error) {
        // Rollback the transaction if any error occurs
        await transaction.rollback();
        return res.status(500).json({ message: `Server error: ${error.message}` });
    }
}

// cancel booking impl end






// email start





// end

module.exports = { addBooking, getAllBookings, cancelBooking };