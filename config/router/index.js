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
    medicineDelete
} = require('../../modules')

const { authorization } = require('../../middleware')

module.exports = (app) => {
    app.get('/', (req, res) => res.send("OK"))
    app.post('/auth/login', authLogin)

    app.get('/user', authorization(['1']), userIndex)
    app.get('/user/:username', authorization(), userDetail)
    app.post('/user/add', authorization(['1']), userAdd)
    app.put('/user/edit', authorization(['1']), userEdit)
    app.delete('/user/delete', authorization(['1']), userDelete)

    app.get('/patient', authorization(), patientIndex)
    app.get('/patient/:id', authorization(), patientDetail)
    app.post('/patient/add', authorization(), patientAdd)
    app.put('/patient/edit', authorization(), patientEdit)
    app.delete('/patient/delete', authorization(), patientDelete)

    app.get('/role', authorization(), roleIndex)
    app.get('/role/:id', authorization(), roleDetail)
    app.post('/role/add', authorization(), roleAdd)
    app.put('/role/edit', authorization(), roleEdit)
    app.delete('/role/delete', authorization(), roleDelete)

    app.get('/medicine', authorization(), medicineIndex)
    app.get('/medicine/:id', authorization(), medicineDetail)
    app.post('/medicine/add', authorization(), medicineAdd)
    app.put('/medicine/edit', authorization(), medicineEdit)
    app.delete('/medicine/delete', authorization(), medicineDelete)

}