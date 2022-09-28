const express = require('express')
const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))
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

const router = express.Router()

router
.route('/')
.get(getAllTours)
.post(addATour)
router
.route('/:id')
.get(getATour)
.patch(updateApost)
.delete(deleteAPost)

module.exports = router;