// In each model we will require the mongo package.
// Steps => 1. Require Mongoose. 2. Create schema and 3. Export model.

// Challenge. Create a schema with name, email, photo , password, passwordConfirm
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');



const userSchema = new mongoose.Schema(
    {
        name: {
            type: String, 
            required: [true,'A user must have a name.']
        }, 
        email: {
            type: String, 
            required: [true,'A user must have a email.'], 
            unique: true, 
            lowercase: true, // Will transform the email to lowercase.
            validator: [validator.isEmail, 'Valid Email']
        }, 
        photo: String, 
        role: {
            type: String, 
            enum: ['user', 'guide', 'lead-guide', 'admin'], 
            default: 'user'
        },
        password: {
            type: String, 
            required: [true,'A user must have a name.'],
            minlength: 8, 
            select: false
        }, 
        passwordConfirm: {
            type: String, 
            required: [true, 'Please confirm the password.'], 
            validate: {
                // We will define the callback function, which will be used on creation of document.
                // We cant use the arrow func because we will use the this keyword.
                validator: function(el) {
                    // el is current element. 
                    return el === this.password // abc === abc then it will pass true. and validation will be true.
                    //VVVV IMP Note: This works on CREATE or ON SAVE.
                }, 
                message: "Passwords are not save."
            }
        }, 
        passwordChangedAt: Date, 
        passwordResetToken: String, 
        passwordResetExpires: Date
    }
);

// We will use pre save middleware to encrypt the password.
// Pre save works between getting the data and saving it.
userSchema.pre('save', async function(next){
    // this refers to the current document.
    // will check first that password field is modified or not in case of update , if modified that only middleware will work.
    if(!this.isModified('password')) return next() // if not modified.
    this.password = await bcrypt.hash(this.password, 12); // hash is a async func.
    this.passwordConfirm = undefined; // delete the passwordconfirm the field.
    next()
})

// We will use instance method which will be avilable throughout all the documents of the collections.It is define on userScehma. 
userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    // this points to document. this.password is not available due to select false.
    return await bcrypt.compare(candidatePassword, userPassword);
};

// We do it later.
// userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
//     // In instance method this always points to current document.
//     console.log("heyaa", JWTTimestamp)
//     if(this.passwordChangedAt){
//         console.log("heyaa", JWTTimestamp)
//         const changedTimestamp = this.passwordChangedAt.getTime()
//         console.log(changedTimestamp, JWTTimestamp);
//     }
//     return false;
// }


userSchema.methods.createPasswordToken = function(){
    // Why we are creating this token.? 
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10*60*1000; // Converted into 10 extra minutes.
    console.log({resetToken}, this.passwordResetToken);
    return resetToken;
}




const User = mongoose.model('User', userSchema)
module.exports = User;


