const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true }); // why merge paramsters ? router.use('/:tourId/reviews', reviewRouter); we are passing the tourId, to get tour id , we merge params.
router.use(authController.protect); // From this point no one can access the middlewares from this point.

router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(authController.restrictTo('user'), reviewController.setTourUserIds, reviewController.creatReview); // Normal users can add their reviews.

router
    .route('/:id')
    .get(reviewController.getReview)
    .delete(authController.restrictTo('user', 'admin'), reviewController.deleteReview)
    .patch(authController.restrictTo('user', 'admin'), reviewController.updateReview)

module.exports = router;
