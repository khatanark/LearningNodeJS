const fs = require('fs');
const express = require('express');
const app = express();
// middleware express.json()  It helps to modify the incoming data
app.use(express.json()); 
const port = 3000;

// Note => Top level code is executed only once when application is started.

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

// It works for get only
app.get('/', (req, res) => {
    res.status(200).send('Hello From the Server Side.')
});

// It works for post only
app.post('/', (req, res) => {
    res.status(200).send('Hello From the Server Side. POst request')
});

// How to send json
app.get('/json', (req, res) => {
    res.status(200).json({title: 'Hello'})
});


// This is the format we will send as it will be easy for the client to understand. 
app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    })
} )

//In Post request we can send data from client to server.This data ideal should be available on requets but nodesjs doesn't include on req
// So will be using middlewares for that.SO in this case we will be using simple middleware express.json() on top. app.use(express.json());
app.post('/api/v1/tours', (req, res) => {
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
} );


app.listen(port, () => {
    console.log('App running')
});
// We have passed the callback function to the listen func.
// Note => Inside callbacks contains non-blocking code.?