const express = require('express');
const app = express();
const port = 3000;


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




app.listen(port, () => {
    console.log('App running')
});
// We have passed the callback function to the listen func.
