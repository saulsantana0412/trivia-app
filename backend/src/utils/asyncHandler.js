export const asyncHandler = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            error.statusCode = error.statusCode || 500
            error.message = error.message || 'Internal Server Error'
            next(error);
        }
    };
};

// const asyncHandler = (fn) => (req, res, next) => {
//     Promise.resolve(fn(req, res, next)).catch(next);
// }