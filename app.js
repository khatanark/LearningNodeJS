const fs = require('fs');
const express = require('express');
const morgan = require('morgan'); // Logging middleware . 3rd party middleware.
const { ppid } = require('process');
const app = express();
// middleware express.json()  It helps to modify the incoming data

// 1) MIDDLEWARES 
app.use(morgan('dev'))  
app.use(express.json()); 

// This is a custom middleware. 
app.use((req, res, next) => {
    console.log("Hello")
    next()
})
const port = 3000;

// Note => Top level code is executed only once when application is started.

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))


//  2) ROUTE HANDLERS
const getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    });
} 

const addATour =  (req, res) => {
    const newId = tours[tours.length-1].id + 1;
    const newTour = Object.assign({id: newId}, req.body);
    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours),
     err => {
        res.status(201).json(
            {
                status: 'success',
                data:{
                    tour: newTour
                }
            }
        )
    });
    console.log(req.body);
}

const getATour = (req, res) => {
    console.log(req.params)
    const id = req.params.id * 1; //Coverting into number js trick

    if(id > tours.length){
        return res.json({
            status: 'success',
            message: 'No tour for this particular id'
        })
    }  // if no tour.

    const tour = tours.find(el => el.id === id) //this is js function.
    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })
}

const updateApost = (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Tour updated'
    })
} 

const deleteAPost = (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Tour Deleted'
    })
} 

const getAllUsers = (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'All users'
    });
} 
const getAUser = (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'All users'
    });
} 
const updateAUser = (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'All users'
    });
} 
const deleteAUser = (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'All users'
    });
} 

// This is the format we will send as it will be easy for the client to understand. 
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', addATour);
// app.get('/api/v1/tours/:id', getATour);
// app.patch('/api/v1/tours/:id', updateApost);
// app.delete('/api/v1/tours/:id', deleteAPost);

// 3) ROUTES
// We will be using router middle ware.
const tourRouter = express.Router()
const userRouter = express.Router()

tourRouter
.route('/')
.get(getAllTours)
.post(addATour)
tourRouter
.route('/:id')
.get(getATour)
.patch(updateApost)
.delete(deleteAPost)

userRouter
.route('/')
.get(getAllUsers)
userRouter
.route('/:id')
.get(getAUser)
.patch(updateAUser)
.delete(deleteAUser)

// These are middleWares
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)


// 4) SERVER
app.listen(port, () => {
    console.log('App running')
});
// We have passed the callback function to the listen func.
// Note => Inside callbacks contains non-blocking code.?