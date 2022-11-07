const fs = require('fs');
const path = require('path')
const express = require('express');
const morgan = require('morgan'); // Logging middleware . 3rd party middleware.
const AppError =  require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const reviewRouter = require('./routes/reviewRoutes')
const app = express();
// middleware express.json()  It helps to modify the incoming data

// Tell the app which view engine to use.
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'))// Tell where are views localted.


// 1) MIDDLEWARES 
app.use(morgan('dev'))  
app.use(express.json()); 
app.use(express.static(`${__dirname}/public`))

const port = 3000;

app.get('/', (req, res) => {
    res.status(200).render('base');
})

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews', reviewRouter) // This is a middleware. Whenever a request with 'api/v1/reviews is hit, reviewRouter is called. This is called mounting.

//IMPORTANT (Handle unhandle routes.)
// Order of middleware is important.
// This is the point where we will be defining the handle the unhandle routes.
// if we are here it means the request is not handled. the req cycele is not complete.
// * means for all the verbs.
app.all('*', (req, res, next) => {
    next(new AppError(`Cant find ${req.originalUrl} on this Server!`, 404));
    // Note if next gets argument then it will assume that it is err0r and it will skip all the middlewares and will go straight to last global one,
})

//GLOBAL MIDDLEWARES.
app.use(globalErrorHandler)

module.exports = app
