const fs = require('fs');
const express = require('express');
const app = express();
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




app.listen(port, () => {
    console.log('App running')
});
// We have passed the callback function to the listen func.
// Note => Inside callbacks contains non-blocking code.?