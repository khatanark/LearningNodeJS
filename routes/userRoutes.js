const express = require('express')
const userController = require('./../controllers/userController')
const router = express.Router()

router
.route('/')
.get(userController.getAllUsers)
router
.route('/:id')
.get(userController.getAUser)
.patch(userController.updateAUser)
.delete(userController.deleteAUser)

module.exports = router