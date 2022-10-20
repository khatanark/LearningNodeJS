// ALl the func related to authentication will be here.
const {promisify} = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel') // Import the user model.
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');
const sendEmail = require('./../utils/email');

// Receives only userId as a paramter.
const siginToken = id => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });  // Payload (User ID),  Secret
}


exports.signup = catchAsync(async(req, res, next) => {
    // We allow onlythe data which we want to use.
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email, 
        password: req.body.password, 
        passwordConfirm: req.body.passwordConfirm
    }); // THis will return a promise so , this must be async func.
 
    const token = siginToken(newUser._id)

    res.status(201).json({
        status: 'Success', 
        token,
        data: {
            tour: newUser
        }
    });
});


exports.login = catchAsync(async (req, res, next) => {
    const {email, password}  = req.body;   // this is same as const email = req.body.email ES6 Syntax.

    // 1). Check email and password exist. 
    if(!email || !password){
        // Why ? Return statement, we want to make sure after login func our func returns?
        return next(new AppError('Please provide the email and password!', 401));
    }

    // 2). Check if user exits and check password is correct.
    // We have made select false, so User.fnd will be not select password , instead we need to make it explicitly inorder to check corret or not.
    const user = await User.findOne({email: email}).select('+password');
    
    // instace method is availble to all the methods.
    // const correct = await user.correctPassword(password, user.password);
    if(!user || !await user.correctPassword(password, user.password)) {
        return next(new AppError('Incorrect email or password', 401))
    }

    // 3). If everything is OK, send the jwt token.

    const token = siginToken(user._id)
    res.status(200).json({
        status: 'Success',
        user, 
        token
    });
})      
//  Note - User.create(req.body) has a security flow . Because if suppose there is field isAdmin and user can pass a field admin: true.
//Instead use => User.create({name: req.body.name}) like this.


exports.protect = catchAsync(async(req, res, next) => {
    //1 ) Getting the Token and check if its exits.
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    };
    console.log(token);
    if(!token){
        return next(new AppError('You are not logged in ! Please login to get access!', 401))
    }
    //2) Validate the Token (JWT ALgo verifies).
    const decoded = await promisify(jwt.verify)(token , process.env.JWT_SECRET) // Pass token and secret.
    console.log(decoded) // On decoded we will get user.
    const user = await User.findById(decoded.id)
    if(!user){
        return next(new AppError('The User belonging to this User doesnt exist', 401))
    }
    req.user = user // Assign the req param the user.
    //3) Check if the user still exits.

    //4) Check if user changed password after token was issued.
    // user.changedPasswordAfter(decoded.iat)
    next();
});

// How to pass the arguments to the middlewares ? By wrapping 
exports.restrictTo = (...roles) => {
    return (req,res, next) => {
        // roles is an array.
        if(!roles.includes(req.user.role)){
            return next(new AppError('You dont have permission to perform this action', 404))
        }
        // If we are here it means it has permission so we go to next middleware.
        next();
    }
}


exports.forgotPassword = catchAsync(async(req, res, next) => {
    // 1) Get User based on posted email.
    const user = await User.findOne({ email: req.body.email});
    console.log(user);
    if(!user){
        return next(new AppError('No user with that email.', 404))
    }
    // 2) Generate the random reset token. 
    const resetToken = user.createPasswordToken();
    // user.save tries to save all of the data so if trtyig to save only one data will giver error ? so validate false.
    await user.save({validateBeforeSave: false}); 
    // 3) send back as an email.
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}}`;
    const message = `Forgot your password ? Submit a Patch request with your new password and password Confirm to: ${resetURL}`
    console.log(message)
    // try{
    try{
        await sendEmail({
            email: req.body.email, 
            subject: 'Your password token valid for 10 min', 
            message
        });

        res.status(200).json({
            status: 'Success', 
            token: 'Token sent to mail'
        });
    } catch (err){
        console.log(err);
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({validateBeforeSave: false});
        return next(new AppError('Try again Later', 500));
    }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    //1) Get User based on the Token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    //Get user based on this token. This is the only thing we know about user.This token is used to find user.
    const user = await User.findOne( 
        { passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now()}
    });
    //2) if token is not expired and there is user set new password.

    if(!user){
        return next(new AppError('Token is invalid or expired', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    this.passwordChangedAt = Date.now()-1000;
    await user.save();
    //3) Update the changed password property for the current user.
    //4) Log the user in and send JWT.
    const token = siginToken(user._id)

    res.status(201).json({
        status: 'Success', 
        token,
        data: {
            token
        }
    });
});

exports.updatePassword =  catchAsync(async (req, res, next) => {
    // Note: Always ask for currentpassword before updating it.
    // 1) Get user from collections.
    const user = await User.findById(req.user.id).select('+password');
    // 2) Check if Posted current password is current.
    if ( !(await user.correctPassword(req.body.passwordConfirm, user.password) ) ){
        return next(new AppError('Your password is wrong.', 500));
    }
    // 3) if so, update the password.
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm
    await user.save()
    
    // 4) Login user, send JWT.
    const token = siginToken(user._id)

    res.status(201).json({
        status: 'Success', 
        token,
        data: {
            token
        }
    });

});


//Note => We dont use update function and instead use save func anything which is related to password. because the validators doesn;t work with update.