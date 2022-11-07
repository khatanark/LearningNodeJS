const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true }); // why merge paramsters ? router.use('/:tourId/reviews', reviewRouter); we are passing the tourId, to get tour id , we merge params.

router
    .route('/')
    .get(authController.protect, reviewController.getAllReviews)
    .post(authController.protect, reviewController.setTourUserIds, reviewController.creatReview);

router
    .route('/:id')
    .get(reviewController.getReview)
    .delete(reviewController.deleteReview)
    .patch(reviewController.updateReview)

module.exports = router;
