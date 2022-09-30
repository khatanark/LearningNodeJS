const Tour = require('./../models/tourModel')

exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
    });
} 

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
            message: 'Invalid data sent!'
        })
    }
};

exports.getATour = (req, res) => {

}

exports.updateApost = (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Tour updated'
    })
} 

exports.deleteAPost = (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Tour Deleted'
    })
}