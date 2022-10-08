// ALl the func related to authentication will be here.
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel') // Import the user model.
const catchAsync = require('./../utils/catchAsync');

exports.signup = catchAsync(async(req, res, next) => {
    // We allow onlythe data which we want to use.
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email, 
        password: req.body.password, 
        passwordConfirm: req.body.passwordConfirm
    }); // THis will return a promise so , this must be async func.
 
    const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    }); // Payload (User ID),  Secret
    res.status(201).json({
        status: 'Success', 
        token,
        data: {
            tour: newUser
        }
    });
});
//  Note - User.create(req.body) has a security flow . Because if suppose there is field isAdmin and user can pass a field admin: true.
//Instead use => User.create({name: req.body.name}) like this.