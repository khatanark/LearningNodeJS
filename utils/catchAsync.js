// We will pass the catchAsync function
module.exports = fn => {
    // when next has argument it knows it will be go to global error handler.
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    }
}
// ???  the func inside catchAsync below is fn ??? how ??