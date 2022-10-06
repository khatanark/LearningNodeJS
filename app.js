const fs = require('fs');
const express = require('express');

// if (process.env.NODE_ENV === 'developement'){
//     app.use(morgan('dev'))
// }
const morgan = require('morgan'); // Logging middleware . 3rd party middleware.
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const app = express();
// middleware express.json()  It helps to modify the incoming data

// 1) MIDDLEWARES 
app.use(morgan('dev'))  
app.use(express.json()); 
app.use(express.static(`${__dirname}/public`))

const port = 3000;

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

// Order of middleware is important.
// Handle unhandle routes. This is the point where we will be defining the routes.
// if we are here it means the request is not handled.
app.all('*', (req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `Cant find ${req.originalUrl} on this Server!`
    })
})


module.exports = app
