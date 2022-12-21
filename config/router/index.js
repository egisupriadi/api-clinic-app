const {
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
} = require('../../modules')

const { authorization } = require('../../middleware')

module.exports = (app) => {
    app.get('/', (req, res) => res.send("OK"))
    app.post('/auth/login', authLogin)

    app.get('/user', authorization(['1']), userIndex)
    app.get('/user/:username', authorization(), userDetail)
    app.post('/user/add', authorization(['1']), userAdd)
    app.put('/user/edit', authorization(['1']), userEdit)
    app.delete('/user/delete/:id', authorization(['1']), userDelete)

    app.get('/patient', authorization(), patientIndex)
    app.get('/patient/:id', authorization(), patientDetail)
    app.post('/patient/add', authorization(), patientAdd)
    app.put('/patient/edit', authorization(), patientEdit)
    app.delete('/patient/delete/:id', authorization(), patientDelete)

    app.get('/role', authorization(), roleIndex)
    app.get('/role/:id', authorization(), roleDetail)
    app.post('/role/add', authorization(), roleAdd)
    app.put('/role/edit', authorization(), roleEdit)
    app.delete('/role/delete/:id', authorization(), roleDelete)

    app.get('/medicine', authorization(), medicineIndex)
    app.get('/medicine/:id', authorization(), medicineDetail)
    app.post('/medicine/add', authorization(), medicineAdd)
    app.put('/medicine/edit', authorization(), medicineEdit)
    app.delete('/medicine/delete/:id', authorization(), medicineDelete)

    app.get('/queue', authorization(), queueIndex)
    app.get('/queue/:id', authorization(), queueDetail)
    app.post('/queue/add', authorization(), queueAdd)
    app.put('/queue/edit', authorization(), queueEdit)
    app.delete('/queue/delete/:id', authorization(), queueDelete)

    app.get('/diagnosis', authorization(), diagnosisIndex)
    app.get('/diagnosis/:id', authorization(), diagnosisDetail)
    app.post('/diagnosis/add', authorization(), diagnosisAdd)
    app.put('/diagnosis/edit', authorization(), diagnosisEdit)
    app.delete('/diagnosis/delete/:id', authorization(), diagnosisDelete)
    app.get('/diagnosis/getByPatient/:id_patient', authorization(), diagnosisGetByPatient)

}