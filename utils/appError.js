// We will create our own error class which will inherit from the built in error class.
class AppError extends Error{
    constructor(message, statusCode) {
        // message is only paramter that built in class handles.
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.operational = true;
        // All the errors will be operational. 
        Error.captureStackTrace(this, this.constructor);
    }
}
module.exports = AppError;