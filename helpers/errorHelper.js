module.exports = {
  customError: class CustomError extends Error {
    constructor(message, statusCode){
      super(message);
      this.status = `${statusCode}`.startsWith("4")? "fail" : "error";
      this.statusCode = statusCode;

      Error.captureStackTrace(this, this.constructor);
    }

  },

  wrapAsync: (fn) => {
    return function(req, res, next){
      fn(req, res, next).catch((err)=>{
        console.log(err);
        return next(err)
      });
    }
  }
}