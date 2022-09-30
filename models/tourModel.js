const mongoose = require('mongoose');
const tourSchema = new mongoose.Schema(
    {
        name: {
        type: String, 
        unique: true,
        required: [true, 'A tour must have a name'] // this is a error msg.
        },
        rating: {type: Number, 
            default: 4
        }
       ,
        price: {
            type: Number, 
            required: [true, 'A tour must have a price']
        }
    }
);

const Tour = mongoose.model('Tour', tourSchema)
module.exports = Tour;
// Where do we need this, we need this we we write update delete , i.e in tour controller.