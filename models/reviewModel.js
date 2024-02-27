const mongoose = require('mongoose');
const slugify = require('slugify')

//Review / rating / createdAt / ref to Tour / ref to User (2 parent refences)
const reviewSchema = new mongoose.Schema(
      {
        review: {
            type: String, 
            required: [true, 'Review Cant be empty']
        }, 
        rating: {
            type: Number, 
            min: 1, 
            max: 5
        }, 
        createdAt: {
            type: Date,
            default: Date.now
        }, 
        tour: {
            type: mongoose.Schema.ObjectId, 
            ref: 'Tour', 
            required: [true, 'Review must belong to Tour']
        }, 
        user: {
            type: mongoose.Schema.ObjectId, 
            ref: 'User', 
            required: [true, 'A review must belong to a user']
        }
      }, 
      {
        // We are defing the options to the schema. that is wantto show the virtual fields.
        toJSON: {virtuals: true}, 
        toObject: {virtuals: true}
    }
  );

  // This will work for all finds.... findone etc.
  reviewSchema.pre(/^find/, function(next) {
    // this.populate({
    //     path:'tour', 
    //     select: 'name'
    // }).populate({
    //     path: 'user', 
    //     select: 'name'
    // })
    this.populate(
        {
            path: 'user',
            select: 'name'
        }
    );
    next();
  });



  const Review = mongoose.model('Review', reviewSchema);
  module.exports = Review;

 