const db = require('../../config/database')
const { response, validation, uuid, pagging } = require('../../utils')
const moment = require('moment')

const selectPrescription = (id_diagnosis) => {
    return new Promise((resolve, reject) => {
        const params = { id_diagnosis, id_medicine }
        const sql = `SELECT a.*, b.name, b.category, b.price FROM tb_prescription a JOIN tb_medicine b ON a.id_medicine = b.id)`
        db.query(sql, params, (error, result) => {
            if (error) {
                reject(error)
                return
            }
            const data = {
                isSuccess: result.affectedRows,
                id: params.id
            }
            resolve(data)
        })
    })
}
const addPrescription = (id_diagnosis, id_medicine) => {
    return new Promise((resolve, reject) => {
        const params = { id_diagnosis, id_medicine }
        const sql = `INSERT INTO tb_prescription(id_medicine, id_diagnosis)
        VALUES(::id_medicine, :id_diagnosis)`
        db.query(sql, params, (error, result) => {
            if (error) {
                reject(error)
                return
            }
            const data = {
                isSuccess: result.affectedRows,
                id: params.id
            }
            resolve(data)
        })
    })
}

const deletePrescription = (id_diagnosis) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM tb_prescription WHERE id_diagnosis=:id_diagnosis', { id_diagnosis }, (error, result) => {
            if (error) {
                reject(error)
                return
            }
            const data = {
                isDeleted: result.affectedRows,
                message: result.message
            }
            resolve(data)
        })
    })
}
const editPrescription = (id_diagnosis, id_medicine) => {
    return new Promise(async (resolve, reject) => {
        try {
            await deletePrescription(id_diagnosis)
            await addPrescription(id_diagnosis)
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
}
exports.index = async (req, res) => {
    let prev = null, next = null, max = null
    let { page, limit } = req.body
    let offset = 0

    let sql = "SELECT * FROM tb_diagnosis"

    if (page && limit) {
        sql += " LIMIT :limit OFFSET :offset"
        let { prev: prevPagging, next: nextPagging, max: maxPagging } = await pagging('tb_diagnosis', page, limit);
        offset = limit * (page - 1)
        prev = prevPagging
        next = nextPagging
        max = maxPagging
    }
    db.query(sql, { limit, offset }, (error, result) => {
        if (error) {
            response(500, error.message, 'Oops, Something Wrong...', res)
            return
        }
        Promise.all(result.map(item => selectPrescription(item.id_diagnosis)))
            .then(resDiagnosis => {
                result = result.map((item, key) => ({ ...item, ...{ medicine: resDiagnosis[key] } }))
                response(200, result, 'Get Data Successfuly', res, prev, next, max)

            })
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
    const sql = "SELECT * FROM tb_diagnosis WHERE id = :id"
    db.query(sql, params, async (error, [result]) => {
        if (error) {
            response(500, error.message, "Oops, Something Wrong...", res)
            return
        }
        if (!result) {
            response(404, "", "Data Not Found", res)
            return
        }
        result.medicine = await selectPrescription(result.id)
        response(200, result, "Get Detail Data Successfuly", res)
    })
}

exports.add = (req, res) => {
    const errors = validation(req.body, ['id_patient', 'id_doctor', 'id_pharmacist', 'detail_diagnosis', 'rest_time', 'medicine'])
    if (errors) {
        response(400, errors, "Invalid Parameter", res)
        return
    }
    const { id: sessionId } = req.auth
    const { id_patient, id_doctor, id_pharmacist, detail_diagnosis, rest_time, medicine } = req.body
    const params = { id: uuid(), id_patient, id_doctor, id_pharmacist, detail_diagnosis, rest_time, created_time: moment().format('YYYY-MM-DD HH:mm:ss'), created_by: sessionId }
    const sql = `INSERT INTO tb_diagnosis(id, id_patient, id_doctor, id_pharmacist, detail_diagnosis, rest_time, created_time)
                VALUES(:id, :id_patient, :id_doctor, :id_pharmacist, :detail_diagnosis, :rest_time, :created_by, :created_time)`
    db.query(sql, params, async (error, result) => {
        if (error) {
            response(500, error.message, "Oops, Something Wrong...", res)
            return
        }
        if (!result.affectedRows) {
            response(500, "", "Add Data Failed", res)
            return
        }
        await Promise.all(medicine.map(item => addPrescription(params.id, item)))
        const data = {
            isSuccess: result.affectedRows,
            id: params.id
        }
        response(200, data, "Add Data Successfuly", res)
    })
}

exports.edit = (req, res) => {
    const errors = validation(req.body, ['id', 'id_patient', 'id_doctor', 'id_pharmacist', 'detail_diagnosis', 'rest_time'])
    if (errors) {
        response(400, errors, "Invalid parameters", res)
        return
    }
    const { id, id_patient, id_doctor, id_pharmacist, detail_diagnosis, rest_time } = req.body;
    const params = { id, id_patient, id_doctor, id_pharmacist, detail_diagnosis, rest_time }
    const sql = `UPDATE tb_diagnosis SET 
            id_patient:id_patient, 
            id_doctor:id_doctor, 
            id_pharmacist:id_pharmacist, 
            detail_diagnosis:detail_diagnosis, 
            rest_time:rest_time
        WHERE id = :id`
    db.query(sql, params, async (error, result) => {
        if (error) {
            response(500, error.message, "Oops, Something Wrong...", res)
            return
        }
        if (!result.affectedRows) {
            response(500, "", "Update Data Failed", res)
            return
        }
        await Promise.all(medicine.map(item => editPrescription(id, item)))
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
    const sql = "DELETE FROM tb_diagnosis WHERE id = :id"
    db.query(sql, params, async (error, result) => {
        if (error) {
            response(500, error.message, "Oops, Something Wrong...", res)
            return
        }
        if (!result.affectedRows) {
            response(404, "", "Data Not Found", res)
            return
        }
        await deletePrescription(id)
        const data = {
            isDeleted: result.affectedRows,
            message: result.message
        }
        response(200, data, 'Deleted Data Successfuly', res)
    })
}

exports.getByPatient = (req, res) => {
    const errors = validation(req.params, ['id_patient'])
    if (errors) {
        response(400, errors, "Invalid Parameter", res)
        return
    }
    const { id_patient } = req.params
    const params = { id_patient }
    const sql = "SELECT * FROM tb_diagnosis WHERE id_patient = :id_patient"
    db.query(sql, params, async (error, result) => {
        if (error) {
            response(500, error.message, "Oops, Something Wrong...", res)
            return
        }
        Promise.all(result.map(item => selectPrescription(item.id_diagnosis)))
            .then(resDiagnosis => {
                result = result.map((item, key) => ({ ...item, ...{ medicine: resDiagnosis[key] } }))
                response(200, result, 'Get Data Successfuly', res, prev, next, max)
            })
    })
}

