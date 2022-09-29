const express = require('express')
const tourController = require('./../controllers/tourController')
const router = express.Router()

// This is params middleware. It will be available for specific params , /api/tours/:id
router.param('id', tourController.checkID)

router
.route('/')
.get(tourController.getAllTours)
.post(tourController.addATour)
router
.route('/:id')
.get(tourController.getATour)
.patch(tourController.updateApost)
.delete(tourController.deleteAPost)

module.exports = router;