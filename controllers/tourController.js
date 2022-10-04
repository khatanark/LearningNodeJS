const Tour = require('./../models/tourModel')
exports.aliasTopTours = async(req, res, next) => {
    req.query.limit = 5;
    req.query.sort = '-ratingAverage,price';
    req.query.fields = 'name,price,ratingAverage,summary,difficulty';
    next();
};

exports.getAllTours = async (req, res) => {
    try{
        console.log(req.query) 
        //http://localhost:3000/api/v1/tours?duration=5&difficulty=easy Express takes cares of query filtering.
        // console.log(req.query)
        // const tours = await Tour.find(req.query) this query will give the results of tours which have duration 5 and difficulty easy.

        // We will create a shallow object to store the query . 
        //1-A) BUILD THE QUERY (Filtering )
        const queryObj = {...req.query}; // this creates the new object instead of referece. 
        const excludeFields = ['page', 'sort', 'limit', 'fields']
        excludeFields.forEach(el => delete queryObj[el]) // we delete these query fields from query objects  http://localhost:3000/api/v1/tours?duration=5&difficulty=easy&sort=1&limit=10

        //1-B) Advance Filtering.
        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        console.log(JSON.parse(queryString));




        let query = Tour.find(JSON.parse(queryString)); 
        // 2) SORTING
        if(req.query.sort){
            // http://localhost:3000/api/v1/tours?sort=price
            query = query.sort(req.query.sort)
        } else {
            query = query.sort('-createdAt'); // Default one.
        }

        // 3) Limiting.
        if(req.query.fields){
            // http://localhost:3000/api/v1/tours?fields=name,duration,difficulty,price
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v'); // Exclude only this field __v
        }

        // 4) Pagination. page=2&limit=3 Page no 2, with only 3 results.
        const page = req.query.page * 1 || 1  // converting string to numver.
        const limit = req.query.limit * 1 || 100; 
        const skip = (page-1) * limit;

        // page=2&limit=10 1-10 Page 1, 11-20 Page 2, 21-30 Page 3.Skip(10) we want to skip 10 results before starting querying.
        query = query.skip(skip).limit(limit);
        if(req.query.page){
            // return no of ducments.
            const numTours = await Tour.countDocuments();
            if( skip > numTours) throw new Error('This page doesnot Exist');
        }
        // {difficulty: 'easy', duration: { $gte: 5}} this is the way to use operator $greater than equal.
        // {difficulty: 'easy', duration: { gte: '5' } } // http://localhost:3000/api/v1/tours?duration[gte]=5&difficulty=easy&sort=1&limit=10 , this is the api we sent from there . Difference so we need to replace gte to $gte. 
        // gte, gt, lte, lt

        // Execute the query
        const tours = await query; // we have changed await from this await Tour.find(req.query) , so that we can apply other operations on query.

        // Send Response.
        res.status(201).json({
            status: 'Success', 
            data: {
                tour: tours
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'Failed',
            message: err
        })
    }
};

exports.addATour =  async (req, res) => {
    //Important => Tour.create method will return a promise. We will wait for that promise using async await.And using Async wait we need to test for error using try catch
    try{
    const newTour = await Tour.create(req.body);
    res.status(201).json({
        status: 'Success', 
        data: {
            tour: newTour
        }
    });
    console.log(req.body);
    } catch (err) {
        res.status(400).json({
            status: 'Failed',
            message: err
        })
    }
};

exports.getATour = async (req, res) => {
    try{
        // params.id because in routes we are using /:id
        const tour = await Tour.findById(req.params.id);
        res.status(201).json({
            status: 'Success', 
            data: {
                tour: tour
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'Failed', 
            message: 'Invalid Data'
        })
    }
}

exports.updateApost = (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Tour updated'
    })
} 

exports.deleteATour = async (req, res) => {
    try {
        await Tour.findByIDAndDelete(req.params.id);
        res.status(200).json({
            status: 'success',
            message: 'Deleted successfully'
        })
    } catch (err) {
        res.status(401).json({
            status: 'failed',
            message: err
        })
    }
}