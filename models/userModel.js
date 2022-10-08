// In each model we will require the mongo package.
// Steps => 1. Require Mongoose. 2. Create schema and 3. Export model.

// Challenge. Create a schema with name, email, photo , password, passwordConfirm
const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')



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
        }
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


const User = mongoose.model('User', userSchema)
module.exports = User;


