const express = require('express')
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const router = express.Router()



router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updateMyPassowrd', authController.protect, authController.updatePassword)

router
.route('/')
.get(userController.getAllUsers)

router
.route('/:id')
.get(userController.getAUser)
.patch(userController.updateAUser)
.delete(userController.deleteAUser)

module.exports = router