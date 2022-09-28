const fs = require('fs');
const express = require('express');
const { ppid } = require('process');
const app = express();
// middleware express.json()  It helps to modify the incoming data
app.use(express.json()); 
const port = 3000;

// Note => Top level code is executed only once when application is started.

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

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

// This is the format we will send as it will be easy for the client to understand. 
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', addATour);
// app.get('/api/v1/tours/:id', getATour);
// app.patch('/api/v1/tours/:id', updateApost);
// app.delete('/api/v1/tours/:id', deleteAPost);


// /api/v1/tours is common in first 2 request so we cant modifiy something like that.
app.route('/api/v1/tours').get(getAllTours).post(addATour)
app.route('/api/v1/tours/:id').get(getATour).patch(updateApost).delete(deleteAPost)

app.listen(port, () => {
    console.log('App running')
});
// We have passed the callback function to the listen func.
// Note => Inside callbacks contains non-blocking code.?