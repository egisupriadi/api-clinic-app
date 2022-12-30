const { response, validation, uuid, pagging } = require('../../utils')
const db = require('../../config/database')
const moment = require('moment')


const cntQueue = (date) => {
    return new Promise((resolve, reject) => {
        const params = { register_date: moment(date).format('YYYY-MM-DD') || moment().format('YYYY-MM-DD') }
        const sql = 'SELECT count(register_date) as cnt FROM tb_queue WHERE register_date=:register_date GROUP BY register_date;'
        db.query(sql, params, (error, [result]) => {
            if (error) {
                reject(error)
            }
            resolve(!result ? 1 : result.cnt + 1)
        })
    })
}

exports.index = async (req, res) => {
    let prev = null, next = null, max = null
    let { page, limit, search } = req.query
    let offset = 0
    let condition = ''

    let sql = "SELECT a.*, b.name, b.dob, b.address, b.phone, TIMESTAMPDIFF(YEAR, b.dob, CURDATE()) AS age FROM tb_queue AS a JOIN tb_patient AS b ON a.id_patient=b.id"
    if (search) {
        search = `%${search}%`
        let col = ['id_patient', 'register_date', 'queue_number']
        condition = ` WHERE ${col.map((item,) => `${item} LIKE :search`).join(' OR ')}`
        sql += condition
    }
    if (page && limit) {
        page = parseInt(page)
        limit = parseInt(limit)
        sql += " LIMIT :limit OFFSET :offset"
        let { prev: prevPagging, next: nextPagging, max: maxPagging } = await pagging('tb_queue', page, limit, condition, search);
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
    const sql = "SELECT a.*, b.name, b.dob, b.address, b.phone, TIMESTAMPDIFF(YEAR, b.dob, CURDATE()) AS age FROM tb_queue AS a JOIN tb_patient AS b ON a.id_patient=b.id WHERE a.id = :id"
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

exports.add = async (req, res) => {
    const errors = validation(req.body, ['id_patient', 'register_date'])
    if (errors) {
        response(400, errors, "Invalid Parameter", res)
        return
    }
    const { id: sessionId } = req.auth
    const { id_patient, register_date } = req.body
    const queue_number = await cntQueue(register_date)
    const params = { id: uuid(), id_patient, queue_number, register_date, created_time: moment().format('YYYY-MM-DD HH:mm:ss'), created_by: sessionId }
    const sql = `INSERT INTO tb_queue(id, id_patient, queue_number, register_date, created_by, created_time) 
                VALUES(:id, :id_patient, :queue_number, :register_date, :created_by, :created_time)`
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
            id: params.id,
            queue_number
        }
        response(200, data, "Add Data Successfuly", res)
    })
}

exports.edit = async (req, res) => {
    const errors = validation(req.body, ['id', 'register_date'])
    if (errors) {
        response(400, errors, "Invalid parameters", res)
        return
    }
    const { id, id_patient, register_date } = req.body;
    const params = { id, id_patient, queue_number, register_date }
    const queue_number = await cntQueue(register_date)
    const sql = `UPDATE tb_queue SET ${id_patient ? `id_patient = :id_patient,` : ''} queue_number = :queue_number, register_date = :register_date WHERE id = :id`
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

exports.dataWeek = (req, res) => {
    let start_week = moment().startOf('week').format('YYYY-MM-DD');
    let end_week = moment().endOf('week').format('YYYY-MM-DD');
    let arr_data = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((item, key) => ({ day: item, date: moment(start_week).add(key + 1, 'days').toDate(), cnt: 0 }))
    let params = { start_week, end_week }
    const sql = `SELECT DATE(register_date) AS register_date, COUNT(register_date) AS cnt FROM tb_queue WHERE register_date >= :start_week AND register_date <= :end_week GROUP BY DATE(register_date)`
    db.query(sql, params, (error, result) => {
        if (error) {
            response(500, error.message, "Oops, Something Wrong...", res)
            return
        }
        result.map(item => arr_data[moment(item.register_date).diff(start_week, 'days')].cnt = item.cnt)
        response(200, arr_data, 'Get Data Successfuly', res)
    })
}
