// By specifing the 4 params , the express knows this is middleware func.
module.exports = (err, req, res, next) => {
    // How do we get to know status code of errr . We will read from err object.
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error' // if not defined will pick up the default one.
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
}