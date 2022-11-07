const express = require('express')
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const router = express.Router()



router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);


// ALl the below ones require authentication. so instead of writing the protect middleware in all, we can directrly specificy router.use below this point.
//Protect all the routes after this middleware.
router.use(authController.protect)

router.get('/me', userController.getMe, userController.getAUser)
router.patch('/updateMyPassowrd',  authController.updatePassword)
router.delete('/deleteMe', authController.deleteMe)

router
.route('/')
.get(userController.getAllUsers)

router
.route('/:id')
.get(userController.getAUser)
.patch(userController.updateAUser)
.delete(userController.deleteAUser)

module.exports = router