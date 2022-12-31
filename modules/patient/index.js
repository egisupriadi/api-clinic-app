const { response, validation, uuid, pagging } = require('../../utils')
const db = require('../../config/database')
const moment = require('moment')

exports.index = async (req, res) => {
    let prev = null, next = null, max = null
    let { page, limit, search } = req.query
    let offset = 0
    let condition = ''

    let sql = "SELECT *, TIMESTAMPDIFF(YEAR, dob, CURDATE()) AS age FROM tb_patient"
    if (search) {
        search = `%${search}%`
        let col = ['name', 'dob', 'address', 'created_time']
        condition = ` WHERE ${col.map((item,) => `${item} LIKE :search`).join(' OR ')}`
        sql += condition
    }
    if (page && limit) {
        page = parseInt(page)
        limit = parseInt(limit)
        sql += " LIMIT :limit OFFSET :offset"
        let { prev: prevPagging, next: nextPagging, max: maxPagging } = await pagging('tb_patient', page, limit, condition, search);
        offset = limit * (page - 1)
        prev = prevPagging
        next = nextPagging
        max = maxPagging
    }
    db.query(sql, { limit, offset, search }, (error, result) => {
        if (error) {
            response(500, error.message, 'Oops, Something Wrong...', res)
            return
        }
        response(200, result, 'Get Data Successfuly', res, prev, next, max)
    })
}

exports.detail = (req, res) => {
    const errors = validation(req.params, ['id'])
    if (errors) {
        response(400, errors, "Invalid Parameter", res)
        return
    }
    const { id } = req.params
    const params = { id }
    const sql = "SELECT *, TIMESTAMPDIFF(YEAR, dob, CURDATE()) AS age FROM tb_patient WHERE id = :id"
    db.query(sql, params, (error, [result]) => {
        if (error) {
            response(500, error.message, "Oops, Something Wrong...", res)
            return
        }
        if (!result) {
            response(404, "", "Data Not Found", res)
            return
        }
        response(200, result, "Get Detail Data Successfuly", res)
    })
}

exports.add = (req, res) => {
    const errors = validation(req.body, ['name', 'dob', 'address', 'gender'])
    if (errors) {
        response(400, errors, "Invalid Parameter", res)
        return
    }
    const { id: sessionId } = req.auth
    const { name, dob, address, phone, gender } = req.body
    const params = { id: uuid(), name, dob, address, phone, gender, created_time: moment().format('YYYY-MM-DD HH:mm:ss'), created_by: sessionId }
    const sql = `INSERT INTO tb_patient(id, name, dob, address, phone, gender, created_by, created_time)
                VALUES(:id, :name, :dob, :address, :phone, :gender, :created_by, :created_time)`
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
            id: params.id
        }
        response(200, data, "Add Data Successfuly", res)
    })
}

exports.edit = (req, res) => {
    const errors = validation(req.body, ['id', 'name', 'dob', 'address', 'gender'])
    if (errors) {
        response(400, errors, "Invalid parameters", res)
        return
    }
    const { id, name, dob, address, phone, gender } = req.body;
    const params = { id, name, dob, address, phone, gender }
    const sql = `UPDATE tb_patient SET 
            name = :name, 
            dob = :dob, 
            address = :address, 
            phone = :phone,
            gender = :gender
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
    const errors = validation(req.params, ['id'])
    if (errors) {
        response(400, errors, "Invalid parameters", res)
        return
    }
    const { id } = req.params
    const params = { id }
    const sql = "DELETE FROM tb_patient WHERE id = :id"
    db.query(sql, params, (error, result) => {
        if (error) {
            response(500, error.message, "Oops, Something Wrong...", res)
            return
        }
        if (!result.affectedRows) {
            response(404, "", "Data Not Found", res)
            return
        }
        const data = {
            isDeleted: result.affectedRows,
            message: result.message
        }
        response(200, data, 'Deleted Data Successfuly', res)
    })
}

