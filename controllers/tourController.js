const Tour = require('./../models/tourModel')
const APIFeatures = require('./../utils/apiFeatures');
exports.aliasTopTours = async(req, res, next) => {
    req.query.limit = 5;
    req.query.sort = '-ratingAverage,price';
    req.query.fields = 'name,price,ratingAverage,summary,difficulty';
    next();
};

exports.getAllTours = async (req, res) => {
    try{
        console.log(req.query) 
        // Execute the query
        // Passing query object.
        // Chaining always work because we are return this after each function
        const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .paginate()
        .limitFields();
        const tours = await features.query; // we have changed await from this await Tour.find(req.query) , so that we can apply other operations on query.

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
            message: err
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