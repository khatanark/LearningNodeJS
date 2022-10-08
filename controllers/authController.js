// ALl the func related to authentication will be here.
const User = require('./../models/userModel') // Import the user model.
const catchAsync = require('./../utils/catchAsync');

exports.signup = catchAsync(async(req, res, next) => {
    const newUser = await User.create(req.body); // THis will return a promise so , this must be async func.
    res.status(201).json({
        status: 'Success', 
        data: {
            tour: newUser
        }
    });
});
