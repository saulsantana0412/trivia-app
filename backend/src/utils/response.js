export const successResponse = (res, data, message = 'OK', status = 200) => {
    return res.status(status).json({
        success: true,
        message,
        data
    })
}

export const errorResponse = (res, message = 'Error', errors, status = 500) => {
    return res.status(status).json({
        success: false,
        message,
        errors
    })
}