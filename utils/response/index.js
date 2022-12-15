module.exports = (status_code, data, message, res, prev = "", next = "", max = "") => {
    let response = {
        payload: {
            status_code,
            data,
            message,
        }
    }
    if (prev || next || max) {
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
