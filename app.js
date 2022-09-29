const fs = require('fs');
const express = require('express');
const morgan = require('morgan'); // Logging middleware . 3rd party middleware.
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const app = express();
// middleware express.json()  It helps to modify the incoming data

// 1) MIDDLEWARES 
app.use(morgan('dev'))  
app.use(express.json()); 
app.use(express.static(`${__dirname}/public`))

// This is a custom middleware. 
app.use((req, res, next) => {
    console.log("Hello")
    next()
})
const port = 3000;

//  2) ROUTE HANDLERS

// This is the format we will send as it will be easy for the client to understand. 
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', addATour);
// app.get('/api/v1/tours/:id', getATour);
// app.patch('/api/v1/tours/:id', updateApost);
// app.delete('/api/v1/tours/:id', deleteAPost);

// 3) ROUTES
// We will be using router middle ware.
// These are middleWares
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

module.exports = app
