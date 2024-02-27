const User = require('./../models/userModel') // Import the user model.
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');
const factory = require('./handlerFactory');

exports.getAllUsers = catchAsync(async(req, res, next) => {
    const users = await User.find();
    res.status(201).json({
        status: 'Success', 
        data: {
            users: users
        }
    });
})

exports.getMe = (req, res, next) => {
    // We want to use the function getOne but there is a slide change , onstead of params.id we want current user, 
    // so we are defining the param id in a middleware. before calling getOne.
    console.log(req.user)
    req.params.id = req.user.id;
    next();
}

exports.getAUser = factory.getOne(User);
// Dont update passwords with this.
exports.updateAUser = factory.updateOne(User);
exports.deleteAUser = factory.deleteOne(User);