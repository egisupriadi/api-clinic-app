const { response, encrypt, validation, uuid } = require('../../utils')
const db = require('../../config/database')

exports.index = (req, res) => {
    const sql = "SELECT * FROM tb_user"
    db.query(sql, (error, result) => {
        if (error) {
            response(500, error.message, "Oops, Something Wrong...", res)
            return
        }
        response(200, result, 'Get Data Successfuly', res)
    })
}

exports.detail = (req, res) => {
    const errors = validation(req.params, ['username'])
    if (errors) {
        response(400, errors, "Invalid parameters", res)
        return
    }
    const { username } = req.params
    const params = { username }
    const sql = `SELECT * FROM tb_user WHERE username = :username`
    db.query(sql, params, (error, [result]) => {
        if (error) {
            response(500, error.message, "Oops, Something Wrong...", res)
            return
        }
        if (!result) {
            response(404, "", "Data Not Found", res)
            return
        }
        response(200, result, 'Get Detail Data Successfuly', res)
    })
}

exports.add = (req, res) => {
    const errors = validation(req.body, ['username', 'password', 'nip', 'fullname', 'dob', 'address', 'phone', 'email', 'role', 'status', 'created_time', 'created_by'])
    if (errors) {
        response(400, errors, "Invalid parameters", res)
        return
    }
    const { username, password, nip, fullname, dob, address, phone, email, role, status, created_time, created_by } = req.body
    const params = { id: uuid(), username, password: encrypt(password), nip, fullname, dob, address, phone, email, role, status, created_time, created_by }
    const sql = `INSERT INTO tb_user(id, username, password, nip, fullname, dob, address, phone, email, role, status, created_time, created_by) 
                    VALUES (:id, :username, :password, :nip, :fullname, :dob, :address, :phone, :email, :role, :status, :created_time, :created_by)`
    db.query(sql, params, (error, result) => {
        if (error) {
            response(500, error.message, "Oops, Something Wrong...", res)
            return
        }
        if (!result.affectedRows) {
            response(500, "", "Add Data Failed", res)
            return
        }
        const data = {
            isSuccess: result.affectedRows,
            id: username
        }
        response(200, data, 'Add Data Successfuly', res)
    })
}

exports.edit = (req, res) => {
    const errors = validation(req.body, ['id', 'nip', 'fullname', 'dob', 'address', 'phone', 'email', 'role', 'status'])
    if (errors) {
        response(400, errors, "Invalid parameters", res)
        return
    }
    const { id, password, nip, fullname, dob, address, phone, email, role, status } = req.body;
    const params = { id, password: encrypt(password), nip, fullname, dob, address, phone, email, role, status }
    const sql = `UPDATE tb_user SET 
            ${password ? `password = :password, ` : ''}
            nip = :nip, 
            fullname = :fullname, 
            dob = :dob, 
            address = :address, 
            phone = :phone, 
            email = :email, 
            role = :role, 
            status = :status
        WHERE id = :id`
    db.query(sql, params, (error, result) => {
        if (error) {
            response(500, error.message, "Oops, Something Wrong...", res)
            return
        }
        if (!result.affectedRows) {
            response(500, "", "Update Data Failed", res)
            return
        }
        const data = {
            isSuccess: result.affectedRows,
            message: result.message
        }
        response(200, data, 'Update Data Successfuly', res)
    })
}

exports.delete = (req, res) => {
    const errors = validation(req.params, ['username'])
    if (errors) {
        response(400, errors, "Invalid parameters", res)
        return
    }
    const { username } = req.body
    const sql = `DELETE FROM tb_user WHERE username = '${username}'`
    db.query(sql, (error, result) => {
        if (error) {
            response(500, error.message, "Oops, Something Wrong...", res)
            return
        }
        if (!result.affectedRows) {
            response(404, "", "User Not Found", res)
            return
        }
        const data = {
            isDeleted: result.affectedRows,
            message: result.message
        }
        response(200, data, 'Deleted Data Successfuly', res)
    })
}