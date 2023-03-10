const db = require('../../config/database')
const { response, validation, uuid, pagging } = require('../../utils')
const moment = require('moment')

const selectPrescription = (id_diagnosis) => {
    return new Promise((resolve, reject) => {
        const params = { id_diagnosis }

        const sql = `SELECT a.*, b.name, b.category, b.price FROM tb_prescription a JOIN tb_medicine b ON a.id_medicine = b.id WHERE a.id_diagnosis=:id_diagnosis`
        db.query(sql, params, (error, result) => {
            if (error) {
                reject(error)
                return
            }
            resolve(result)
        })
    })
}
const addPrescription = (id_diagnosis, id_medicine) => {
    return new Promise((resolve, reject) => {
        const params = { id_diagnosis, id_medicine }
        const sql = `INSERT INTO tb_prescription(id_medicine, id_diagnosis)
        VALUES(:id_medicine, :id_diagnosis)`
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
            await addPrescription(id_diagnosis, id_medicine)
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
}
exports.index = async (req, res) => {
    let prev = null, next = null, max = null
    let { page, limit, search } = req.query
    let offset = 0
    let condition = ''
    let sql = "SELECT a.*, b.name AS patient_name, TIMESTAMPDIFF(YEAR, b.dob, CURDATE()) AS age_patient, b.gender as gender_patient, c.fullname AS doctor_name, d.fullname AS pharmacist_name FROM tb_diagnosis AS a LEFT JOIN tb_patient AS b on a.id_patient=b.id LEFT JOIN tb_user AS c on a.id_doctor=c.id LEFT JOIN tb_user AS d on a.id_pharmacist=c.id"

    if (search) {
        search = `%${search}%`
        let col = ['id_patient', 'id_doctor', 'id_pharmacist', 'detail_diagnosis', 'rest_time', 'medicine', 'created_time']
        condition = ` WHERE ${col.map((item,) => `${item} LIKE :search`).join(' OR ')}`
        sql += condition
    }
    if (page && limit) {
        page = parseInt(page)
        limit = parseInt(limit)
        sql += " LIMIT :limit OFFSET :offset"
        let { prev: prevPagging, next: nextPagging, max: maxPagging } = await pagging('tb_diagnosis', page, limit, condition, search);
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
        Promise.all(result.map(item => selectPrescription(item.id)))
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
    const sql = "SELECT a.*, b.name AS patient_name, TIMESTAMPDIFF(YEAR, b.dob, CURDATE()) AS age_patient, b.gender as gender_patient, c.fullname AS doctor_name, d.fullname AS pharmacist_name FROM tb_diagnosis AS a LEFT JOIN tb_patient AS b on a.id_patient=b.id LEFT JOIN tb_user AS c on a.id_doctor=c.id LEFT JOIN tb_user AS d on a.id_pharmacist=c.id WHERE a.id = :id"
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
    const errors = validation(req.body, ['id_patient', 'id_doctor', 'detail_diagnosis', 'complaint', 'medicine'])
    if (errors) {
        response(400, errors, "Invalid Parameter", res)
        return
    }
    const { id: sessionId } = req.auth
    const { id_patient, id_doctor, id_pharmacist, detail_diagnosis, rest_time, complaint, medicine } = req.body
    const params = { id: uuid(), id_patient, id_doctor, id_pharmacist: id_pharmacist || '', detail_diagnosis, rest_time: rest_time || '', complaint, status: 'Periksa', created_time: moment().format('YYYY-MM-DD HH:mm:ss'), created_by: sessionId }
    const sql = `INSERT INTO tb_diagnosis(id, id_patient, id_doctor, id_pharmacist, detail_diagnosis, rest_time, complaint, status, created_time, created_by)
                VALUES(:id, :id_patient, :id_doctor, :id_pharmacist, :detail_diagnosis, :rest_time, :complaint, :status, :created_time, :created_by)`
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
    const errors = validation(req.body, ['id', 'id_patient', 'id_doctor', 'detail_diagnosis', 'complaint', 'status', 'medicine'])
    if (errors) {
        response(400, errors, "Invalid parameters", res)
        return
    }
    const { id, id_patient, id_doctor, id_pharmacist, detail_diagnosis, rest_time, complaint, status, medicine } = req.body;
    const params = { id, id_patient, id_doctor, id_pharmacist, detail_diagnosis, rest_time, complaint, status }
    const sql = `UPDATE tb_diagnosis SET 
            id_patient=:id_patient, 
            id_doctor=:id_doctor, 
            id_pharmacist=:id_pharmacist, 
            detail_diagnosis=:detail_diagnosis, 
            rest_time=:rest_time,
            complaint=:complaint,
            status=:status
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

