const Tour = require('./../models/tourModel')
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

exports.aliasTopTours = async(req, res, next) => {
    req.query.limit = 5;
    req.query.sort = '-ratingAverage,price';
    req.query.fields = 'name,price,ratingAverage,summary,difficulty';
    next();
};

exports.getAllTours = factory.getAll(Tour)
exports.getATour = factory.getOne(Tour, {path: 'reviews'});
exports.addATour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteATour = factory.deleteOne(Tour);

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