module.exports = (object, keys) => {
    let error = []
    keys.forEach(function (k) {
        if (k in object) {
            if (object[k] === '') {
                error = [...error, { column: k, message: `${k} exists but is empty` }]
            }
            return;
        }
        error = [...error, { column: k, message: `${k} doesn't exist in object` }]
    });
    return error.length > 0 ? error : false;
}