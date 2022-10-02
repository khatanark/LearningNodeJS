const mongoose = require('mongoose');
const tourSchema = new mongoose.Schema(
    {
        name: {
        type: String, 
        unique: true,
        trim: true,
        required: [true, 'A tour must have a name'] // this is a error msg.
        },
        duration: {
            type: Number, 
            required: [true, 'A tour must have a duration']
        },
        maxGroupSize: {
            type: Number,
            required: [true, 'A tour must have a group size']
        },
        difficulty: {
            type: String, 
            required: [true, 'A tour must have a difficulty']
        },
        ratingsAverage: {type: Number, 
            type: Number,
            default: 4.5
        },
        ratingsQuantity: {
            type: Number, 
            default: 0
        },
        price: {
            type: Number, 
            required: [true, 'A tour must have a price']
        },
        discount: Number, 
        summary: {
            type: String,
            trim: true  // only works for string.
        },
        description: {
            type: String, 
            required: true
        }, 
        imageCover:{
            type: String, 
            required: true
        }, 
        images: [String],
        createdAt: {
            type: Date, 
            default: Date.now()
        }, 
        startDates: [Date]
    }
);

const Tour = mongoose.model('Tour', tourSchema)
module.exports = Tour;
// Where do we need this, we need this we we write update delete , i.e in tour controller.
// Business Logic must be here.And application code. 