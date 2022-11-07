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

exports.getAUser = factory.getOne(User);
// Dont update passwords with this.
exports.updateAUser = factory.updateOne(User);
exports.deleteAUser = factory.deleteOne(User);