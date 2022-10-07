// In each model we will require the mongo package.
// Steps => 1. Require Mongoose. 2. Create schema and 3. Export model.

// Challenge. Create a schema with name, email, photo , password, passwordConfirm
const mongoose = require('mongoose');
const validator = require('validator')



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
        password: {
            type: String, 
            required: [true,'A user must have a name.'],
            minlength: 8
        }, 
        passwordConfirm: {
            type: String, 
            required: [true, 'Please confirm the password.']
        }
    }
);

const User = mongoose.model('User', userSchema)
module.exports = User;


