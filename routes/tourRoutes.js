const express = require('express')
const tourController = require('./../controllers/tourController')

const authController = require('./../controllers/authController')
// const reviewController = require('./../controllers/reviewController')
const reviewRouter = require('./../routes/reviewRoutes');
const router = express.Router()


 //NESTED ROUTES 
  // ex - 27374394 is tour id 
  // POST /tours/27374394/reviews - to create the reviews of a particular tour.
  // GET /tours/27374394/reviews - to get the reviews of a particular tour.
  // GET /tours/27374394/reviews/238853 - to get the particular review of a tour.

  router.use('/:tourId/reviews', reviewRouter); // Router itself is a middleware.



// This is params middleware. It will be available for specific params , /api/tours/:id
// router.param('id', tourController.checkID)

// Create check body middleware . check wheather input contains title and price or not.
// if not send back status 400 bad request.
router.route('/tour-stats').get(tourController.getTourStats)
router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours) // tourController.aliasTopTours this is the middleware.

router
.route('/')
.get(tourController.getAllTours) // First wil run auth middleware then getalltours
.post(authController.protect, authController.restrictTo('admin'), tourController.addATour) // Chaining a param middleware. 

router
.route('/:id')
.get(tourController.getATour)
.patch(tourController.updateTour)
.delete(authController.protect, authController.restrictTo('admin') ,tourController.deleteATour)

// Method 1 => of nested routes. 
// router
// .route('/:tourId/reviews')
// .post(authController.protect, reviewController.creatReview)

module.exports = router;




