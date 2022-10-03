const Tour = require('./../models/tourModel')

exports.getAllTours = async (req, res) => {
    try{
        //http://localhost:3000/api/v1/tours?duration=5&difficulty=easy Express takes cares of query filtering.
        // console.log(req.query)
        // const tours = await Tour.find(req.query) this query will give the results of tours which have duration 5 and difficulty easy.
        const tours = await Tour.find()
        res.status(201).json({
            status: 'Success', 
            data: {
                tour: tours
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'Failed',
            message: 'Invalid data sent!'
        })
    }
};

exports.addATour =  async (req, res) => {
    //Important => Tour.create method will return a promise. We will wait for that promise using async await.And using Async wait we need to test for error using try catch
    try{
    const newTour = await Tour.create(req.body);
    res.status(201).json({
        status: 'Success', 
        data: {
            tour: newTour
        }
    });
    console.log(req.body);
    } catch (err) {
        res.status(400).json({
            status: 'Failed',
            message: err
        })
    }
};

exports.getATour = async (req, res) => {
    try{
        // params.id because in routes we are using /:id
        const tour = await Tour.findById(req.params.id);
        res.status(201).json({
            status: 'Success', 
            data: {
                tour: tour
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'Failed', 
            message: 'Invalid Data'
        })
    }
}

exports.updateApost = (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Tour updated'
    })
} 

exports.deleteATour = async (req, res) => {
    try {
        await Tour.findByIDAndDelete(req.params.id);
        res.status(200).json({
            status: 'success',
            message: 'Deleted successfully'
        })
    } catch (err) {
        res.status(401).json({
            status: 'failed',
            message: err
        })
    }
}