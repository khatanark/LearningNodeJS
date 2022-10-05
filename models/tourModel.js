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
            default: Date.now(), 
            select: false // It will never be shown to client. 
        }, 
        startDates: [Date]
    } , {
        // We are defing the options to the schema. that is wantto show the virtual fields.
        toJSON: {virtuals: true}, 
        toObject: {virtuals: true}
    }
);
// Virtauls fields are those which are derived and are not saved in the database. 
// We will define the tour propety on the schema , we have not used arrow func because it doesn't have its own this.
tourSchema.virtual('durationWeeks').get(function(){
    // this will be poining to tour documents.
    return this.duration/7;
});

const Tour = mongoose.model('Tour', tourSchema)
module.exports = Tour;
// Where do we need this, we need this we we write update delete , i.e in tour controller.
// Business Logic must be here.And application code. 