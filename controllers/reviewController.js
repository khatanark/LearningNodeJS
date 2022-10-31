const Review = require('./../models/reviewModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');

exports.getAllReviews = catchAsync(async(req, res, next) => {
    const reviews = await Review.find();
    res.status(200).json({
        status: 'Success', 
        results: reviews.length, 
        data: {
            reviews
        }
    });
});

exports.creatReview = catchAsync(async(req, res, next) => {
    const newReview = await Review.create(req.body);
    res.status(201).json({
        status: 'Success', 
        data: {
            newReview
        }
    });
})