const { login: authLogin } = require('./auth')
const { index: userIndex, detail: userDetail, add: userAdd, edit: userEdit, delete: userDelete } = require('./users')
const { index: patientIndex, detail: patientDetail, add: patientAdd, edit: patientEdit, delete: patientDelete } = require('./patient')
const { index: roleIndex, detail: roleDetail, add: roleAdd, edit: roleEdit, delete: roleDelete } = require('./roles')
const { index: medicineIndex, detail: medicineDetail, add: medicineAdd, edit: medicineEdit, delete: medicineDelete } = require('./medicine')
const { index: queueIndex, detail: queueDetail, add: queueAdd, edit: queueEdit, delete: queueDelete } = require('./queue')
const { index: diagnosisIndex, detail: diagnosisDetail, add: diagnosisAdd, edit: diagnosisEdit, delete: diagnosisDelete, getByPatient: diagnosisGetByPatient } = require('./diagnosis')

module.exports = {
    authLogin,
    userIndex,
    userDetail,
    userAdd,
    userEdit,
    userDelete,
    patientIndex,
    patientDetail,
    patientAdd,
    patientEdit,
    patientDelete,
    roleIndex,
    roleDetail,
    roleAdd,
    roleEdit,
    roleDelete,
    medicineIndex,
    medicineDetail,
    medicineAdd,
    medicineEdit,
    medicineDelete,
    queueIndex,
    queueDetail,
    queueAdd,
    queueEdit,
    queueDelete,
    diagnosisIndex,
    diagnosisDetail,
    diagnosisAdd,
    diagnosisEdit,
    diagnosisDelete,
    diagnosisGetByPatient,
}