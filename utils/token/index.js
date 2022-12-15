const jwt = require('jsonwebtoken')
const SECRET_KEY_TOKEN = 'Utama2022Token'

exports.generateToken = (data) => {
    const token = jwt.sign({ data }, SECRET_KEY_TOKEN, {
        expiresIn: (12 * 60 * 60)
    })
    return token;
}

exports.verifyToken = (token, callback) => {
    jwt.verify(token, SECRET_KEY_TOKEN, (error, result) => {
        callback(error ? false : result)
    })
}