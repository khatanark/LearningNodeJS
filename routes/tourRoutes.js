const express = require('express')
const tourController = require('./../controllers/tourController')
const router = express.Router()
 
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