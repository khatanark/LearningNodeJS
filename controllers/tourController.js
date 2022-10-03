const Tour = require('./../models/tourModel')

exports.getAllTours = async (req, res) => {
    try{
        //http://localhost:3000/api/v1/tours?duration=5&difficulty=easy Express takes cares of query filtering.
        // console.log(req.query)
        // const tours = await Tour.find(req.query) this query will give the results of tours which have duration 5 and difficulty easy.

        // We will create a shallow object to store the query . 
        // BUILD THE QUERY
        const queryObj = {...req.query}; // this creates the new object instead of referece. 
        const excludeFields = ['page', 'sort', 'limit', 'fields']
        excludeFields.forEach(el => delete queryObj[el]) // we delete these query fields from query objects  http://localhost:3000/api/v1/tours?duration=5&difficulty=easy&sort=1&limit=10
        console.log(queryObj, req.query)

        const query = Tour.find(queryObj);


        // Execute the query
        const tours = await query; // we have changed await from this await Tour.find(req.query) , so that we can apply other operations on query.

        // Send Response.
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