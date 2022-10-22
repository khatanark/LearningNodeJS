const mongoose = require('mongoose');
const slugify = require('slugify')
const tourSchema = new mongoose.Schema(
    {
        name: {
        type: String, 
        unique: true,
        trim: true,
        required: [true, 'A tour must have a name'] // this is a error msg.
        },
        slug: {
            type: String
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
        startDates: [Date], 
        secretTour: {
            type: Boolean,
            default: false
        },
        // We have created a object for startLocation , which should have atleast 2 fields. Like here type and coordinates.
        startLocation: {
            //Geo Special data.
            type: {
                type: String, 
                default: 'Point', 
                enum: ['Point'] // Possible options
            },
            // we expect no of points. Latitude and longitude.
            coordinates: [Number] , 
            address: String, 
            description: String
        }, 
        // Inside array we have objects.
        locations: [
            {
                type: {
                    type: String, 
                    default: 'Point', 
                    enum: ['Point'] 
                }, 
                coordinates: [Number], 
                address: String, 
                description: String, 
                day: Number
            }
        ]
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

//DOCUMENT MIDDLEWARES.
tourSchema.pre('save', function(next){
    // thhis is the curretly process data
    this.slug = slugify(this.name, {lower: true});
    next()
    console.log(this);
})

// tourSchema.post('save', function(doc, next){
//     console.log(doc)
//     next()
// })

// QUERY MIDDLEWARES.
tourSchema.pre('find', function(next){
    // thhis will point to the current query.
    this.find({ secretTour: { $ne: true}})
    next();
})


const Tour = mongoose.model('Tour', tourSchema)
module.exports = Tour;
// Where do we need this, we need this we we write update delete , i.e in tour controller.
// Business Logic must be here.And application code. 