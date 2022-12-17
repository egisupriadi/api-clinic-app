const { response, validation, uuid } = require('../../utils')
const db = require('../../config/database')

exports.index = (req, res) => {
    const sql = "SELECT * FROM tb_queue"
    db.query(sql, (error, result) => {
        if (error) {
            response(500, error.message, 'Oops, Something Wrong...', res)
            return
        }
        response(200, result, 'Get Data Successfuly', res)
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
    const sql = "SELECT * FROM tb_queue WHERE id = :id"
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
    const errors = validation(req.body, ['id_patient', 'queue_number', 'register_time', 'created_by', 'created_time'])
    if (errors) {
        response(400, errors, "Invalid Parameter", res)
        return
    }
    const { id_patient, queue_number, created_by, created_time, register_time } = req.body
    const params = { id: uuid(), id_patient, queue_number, created_by, created_time, register_time }
    const sql = `INSERT INTO tb_queue(id, id_patient, queue_number, register_time, created_by, created_time) 
                VALUES(:id, :id_patient, :queue_number, :register_time, :created_by, :created_time)`
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
    const errors = validation(req.body, ['id', 'id_patient', 'queue_number', 'register_time'])
    if (errors) {
        response(400, errors, "Invalid parameters", res)
        return
    }
    const { id, id_patient, queue_number, register_time } = req.body;
    const params = { id, id_patient, queue_number, register_time }
    const sql = `UPDATE tb_queue SET id_patient = :id_patient, queue_number = :queue_number, register_time = :register_time WHERE id = :id`
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
    const errors = validation(req.body, ['id'])
    if (errors) {
        response(400, errors, "Invalid parameters", res)
        return
    }
    const { id } = req.body
    const params = { id }
    const sql = "DELETE FROM tb_queue WHERE id = :id"
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

