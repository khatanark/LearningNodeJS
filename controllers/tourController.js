const Tour = require('./../models/tourModel')
 
exports.checkBody = (req, res, next, val ) => {
    console.log('I am in the middleware')
    if(!req.body.name || !req.body.price) {
        return res.status(400).json(
            {
                status: 'Failed',
                messgae: 'Missing Price or Name'
            }
        )
    }
    next();
}

exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
    });
} 

exports.addATour =  (req, res) => {
    console.log(req.body);
}

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