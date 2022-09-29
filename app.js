const fs = require('fs');
const express = require('express');

if (process.env.NODE_ENV === 'developement'){
    app.use(morgan('dev'))
}
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

module.exports = app
