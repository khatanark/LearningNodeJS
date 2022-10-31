const Tour = require('./../models/tourModel')
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
console.log(APIFeatures);

exports.aliasTopTours = async(req, res, next) => {
    req.query.limit = 5;
    req.query.sort = '-ratingAverage,price';
    req.query.fields = 'name,price,ratingAverage,summary,difficulty';
    next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {

        // Execute the query
        // Passing query object.
        // Chaining always work because we are return this after each function
        const features = new APIFeatures(Tour.find(), req.query)
        // .filter()
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
});




exports.addATour =  catchAsync(async (req, res, next) => {
    //Important => Tour.create method will return a promise. We will wait for that promise using async await.And using Async wait we need to test for error using try catch
    const newTour = await Tour.create(req.body);
    res.status(201).json({
        status: 'Success', 
        data: {
            tour: newTour
        }
    });
});

exports.getATour = catchAsync(async (req, res, next) => {
        // params.id because in routes we are using /:id
        const tour = await Tour.findById(req.params.id).populate('guides'); // We want to populate the fields which have guildes. 
        res.status(201).json({
            status: 'Success', 
            data: {
                tour: tour
            }
        });
})

exports.updateApost = (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Tour updated'
    })
} 

exports.deleteATour = catchAsync(async (req, res, next) => {
        console.log("I am in delete", req.params.id)
        const tour_id = req.params.id;
        await Tour.findByIdAndDelete(tour_id);
        res.status(200).json({
            status: 'success',
            message: 'Deleted successfully'
        })
})


exports.getTourStats = catchAsync(async(req, res, next) => {
        // We will pass the stages in the aggregate, and we will use stages one by one.
        const stats = await Tour.aggregate([
            // Match stage , will match the tours whose ratings are gte 4.5
            {
                $match: {ratingsAverage: { $gte: 4.5}}
            }, 
            {
                $group: {
                    // What do we group by.
                    _id: '$difficulty', 
                    num: { $sum: 1}, // for each document, it will add one.
                    avgRating: { $avg: '$ratingsAverage'},
                    avgPrice: {$avg: '$price'}, 
                    minPrice: {$min: '$price'},
                    maxPrice: {$max: '$price'}
                }
            }
        ])

        res.status(201).json({
            status: 'Success', 
            data: {
                stats
            }
        });
})