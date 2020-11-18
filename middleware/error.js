/*
 * caller function for global error handling
 */
module.exports.use = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next).catch(next));
};


/*
 * handler function for global errors
 */
module.exports.errorHandler = (err, req, res, next) => {
    let statusCode = undefined;

    if (err.statusCode) statusCode = err.statusCode;
    if (err.status) statusCode = err.status;

    if (process.env.APP_ENV === "production") {
        res.status(statusCode || 500).json({
            success: 0,
            message: err.message || "SERVER ERROR"
        })
    } else {
        res.status(statusCode || 500).json({
            success: 0,
            message: err.message,
            stack: err.stack
        })
    }
};