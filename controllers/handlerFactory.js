const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

//Note: The goal is to create a function which returns another function.
// The goal is to create functions such that we justdont need to create new functions again and again. as delete a review or delete a tour both does the same work so just , tht is delete the only difference is model name.

// This is generic function and works for all.
exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if(!doc) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        message: 'Deleted successfully' 
    });
})
// exports.deleteATour = catchAsync(async (req, res, next) => {
//     console.log("I am in delete", req.params.id)
//     const tour_id = req.params.id;
//     await Tour.findByIdAndDelete(tour_id);
//     res.status(200).json({
//         status: 'success',
//         message: 'Deleted successfully'
//     })
// })



// Arrow functions.
exports.updateOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body , {
        new: true, 
        runValidators: true
    });

    if(!doc) {
        return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    });
})

exports.createOne = Model => catchAsync(async (req, res, next) => {
    //Important => Model.create method will return a promise. We will wait for that promise using async await.And using Async wait we need to test for error using try catch
    const doc = await Model.create(req.body)
    res.status(201).json({
        status: 'Success', 
        data: {
            data: doc
        }
    });
})