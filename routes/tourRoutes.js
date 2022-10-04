const express = require('express')
const tourController = require('./../controllers/tourController')
const router = express.Router()

// This is params middleware. It will be available for specific params , /api/tours/:id
// router.param('id', tourController.checkID)

// Create check body middleware . check wheather input contains title and price or not.
// if not send back status 400 bad request.
router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours) // tourController.aliasTopTours this is the middleware.

router
.route('/')
.get(tourController.getAllTours)
.post(tourController.addATour) // Chaining a param middleware. 

router
.route('/:id')
.get(tourController.getATour)
.patch(tourController.updateApost)
.delete(tourController.deleteATour)

module.exports = router;