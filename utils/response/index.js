module.exports = (status_code, data, message, res, prev = null, next = null, max = null) => {
    let response = {
        payload: {
            status_code,
            data,
            message,
        }
    }
    if (prev === null || next === null || max === null) {
        response = {
            ...response, ...{
                pagination: {
                    prev,
                    next,
                    max,
                }
            }
        }
    }
    res.status(status_code).json(response)
    res.end()
}
