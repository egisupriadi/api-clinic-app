const { response, verifyToken } = require('../../utils')

module.exports = (roles = "") => {
    return (req, res, next) => {
        const tokenWithBearer = req.headers.authorization
        if (!tokenWithBearer) {
            response(401, "", "Token not defined", res)
            return
        }
        const [bearer, token] = tokenWithBearer.split(' ')
        verifyToken(token, (decode) => {
            if (!decode) {
                response(401, "", "Invalid token", res)
                return
            }
            const { data, iat, exp } = decode
            if (roles && (!data.role || !roles.includes(data.role))) {
                response(401, "", "Authorization Failed", res)
                return
            }
            req.auth = data
            next()
        })
    }
}