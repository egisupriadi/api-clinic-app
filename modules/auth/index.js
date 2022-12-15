const ip = require('ip')
const { response, validation, encrypt, decrypt, generateToken, uuid } = require('../../utils')
const db = require('../../config/database')


exports.login = (req, res) => {
    const errors = validation(req.body, ['username', 'password'])
    if (errors) {
        response(400, errors, 'Invalid Parameters', res)
        return
    }
    const { username, password } = req.body
    const params = { username, password: encrypt(password) }
    const sql = "SELECT * FROM tb_user WHERE username = :username"
    db.query(sql, params, (error, [result]) => {
        if (error) {
            response(500, error.message, 'Oops, Something wrong...', res)
            return
        }
        if (!result) {
            response(404, "", "User Not Found", res)
            return
        }
        if (decrypt(result.password) != password) {
            response(400, "", "Invalid Username or Password", res)
            return
        }
        if (result.status == 0) {
            response(400, "", "User Inactive. Please contact Administator", res)
            return
        }
        const data = {
            id_user: result.id,
            token: generateToken(result),
            ip_address: ip.address()
        }
        const params_token = { ...data, ...{ id: uuid() } }
        const sql_token = "REPLACE INTO tb_token(id, id_user, token, ip_address) VALUES(:id, :id_user, :token, :ip_address)"
        db.query(sql_token, params_token, (error, result) => { })

        response(200, data, "Login Successfuly", res)
    })
}