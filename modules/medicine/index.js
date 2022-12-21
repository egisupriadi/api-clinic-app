const { response, validation, uuid, pagging } = require('../../utils')
const db = require('../../config/database')
const moment = require('moment')

exports.index = async (req, res) => {
    let prev = null, next = null, max = null
    let { page, limit, search } = req.query
    let offset = 0
    let condition = ''

    let sql = "SELECT * FROM tb_medicine"
    if (search) {
        search = `%${search}%`
        let col = ['name', 'category', 'price', 'stock', 'created_time']
        condition = ` WHERE ${col.map((item,) => `${item} LIKE :search`).join(' OR ')}`
        sql += condition
    }
    if (page && limit) {
        page = parseInt(page)
        limit = parseInt(limit)
        sql += " LIMIT :limit OFFSET :offset"
        let { prev: prevPagging, next: nextPagging, max: maxPagging } = await pagging('tb_medicine', page, limit, condition, search);
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
    const sql = "SELECT * FROM tb_medicine WHERE id = :id"
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
    const errors = validation(req.body, ['name', 'category', 'price', 'stock'])
    if (errors) {
        response(400, errors, "Invalid Parameter", res)
        return
    }
    const { id: sessionId } = req.auth
    const { name, category, price, stock } = req.body
    const params = { id: uuid(), name, category, price, stock, created_time: moment().format('YYYY-MM-DD HH:mm:ss'), created_by: sessionId }
    const sql = `INSERT INTO tb_medicine(id, name, category, price, stock, created_by, created_time)
                VALUES(:id, :name, :category, :price, :stock, :created_by, :created_time)`
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
    const errors = validation(req.body, ['id', 'name', 'category', 'price', 'stock'])
    if (errors) {
        response(400, errors, "Invalid parameters", res)
        return
    }
    const { id, name, category, price, stock } = req.body;
    const params = { id, name, category, price, stock }
    const sql = `UPDATE tb_medicine SET 
            name = :name, 
            category = :category, 
            price = :price, 
            stock = :stock
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
    const sql = "DELETE FROM tb_medicine WHERE id = :id"
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

