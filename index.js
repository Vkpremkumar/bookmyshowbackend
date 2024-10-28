const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const authRoute = require('./routes/authroutes');
const userRoute = require('./routes/userroutes');
const countryRoute = require('./routes/countryroutes');
const stateRoute = require('./routes/stateroutes');
const cityRoute = require('./routes/cityroutes');
const theatreRoute = require('./routes/theatreroutes');
const languageRoute = require('./routes/languageroutes');
const movieRoute = require('./routes/movieroutes');
const showTimeRoute = require('./routes/showtimeroutes');
const bookingRoute = require('./routes/bookingroutes');

const cors = require('cors');
server.use(cors());



dotenv.config();

Port = process.env.PORT || 10000;



// middleware
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));


// router url

server.use('/api/auth', authRoute);
server.use('/api/user', userRoute);
server.use('/api/country', countryRoute);
server.use('/api/state', stateRoute);
server.use('/api/city', cityRoute);
server.use('/api/theatre', theatreRoute);
server.use('/api/language', languageRoute);
server.use('/api/movie', movieRoute);
server.use('/api/showTime', showTimeRoute);
server.use('/api/booking', bookingRoute);







// listening port
server.listen(Port, () => {
    console.log(`Server listening at Port ${Port}`)
})
