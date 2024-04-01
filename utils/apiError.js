// @desc this is class is responsible about operational (errors that I can predict)
class ApiError extends Error{
    constructor(message , statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith(4)?'fail':'error';
        this.isOperational = true;
        //this.msg = message;
    }

}

module.exports = ApiError;