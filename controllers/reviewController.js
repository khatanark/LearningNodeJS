const Review = require('./../models/reviewModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');

exports.getAllReviews = catchAsync(async(req, res, next) => {
    let filter = {}
    if(req.params.tourId) filter = {tour: req.params.tourId}; // if no tour id , filter is empty and we will get all the reviews.
    const reviews = await Review.find(filter);
    res.status(200).json({
        status: 'Success', 
        results: reviews.length, 
        data: {
            reviews
        }
    });
});

exports.creatReview = catchAsync(async(req, res, next) => {
    //Allow nested routes.
    if(!req.body.tour) req.body.tour = req.params.tourId
    if(!req.body.user) req.body.user = req.user.id; // we get req.user.id from protect middleware.
    const newReview = await Review.create(req.body);
    res.status(201).json({
        status: 'Success', 
        data: {
            newReview
        }
    });
})