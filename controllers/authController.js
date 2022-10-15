// ALl the func related to authentication will be here.
const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel') // Import the user model.
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');

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
    //3) Check if the user still exits.

    //4) Check if user changed password after token was issued.
    // user.changedPasswordAfter(decoded.iat)
    next();
});