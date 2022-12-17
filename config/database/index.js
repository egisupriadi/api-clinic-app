const mysql = require('mysql')
const db = mysql.createConnection({
    host: 'sql6.freesqldatabase.com',
    user: 'sql6584697',
    password: 'FE1itWkWw3',
    database: 'sql6584697'
})
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'clinic_app'
// })
db.connect(err => {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + db.threadId);
})
db.config.queryFormat = function (query, values) {
    if (!values) return query;
    return query.replace(/\:(\w+)/g, function (txt, key) {
        if (values.hasOwnProperty(key)) {
            return this.escape(values[key]);
        }
        return txt;
    }.bind(this));
};
module.exports = db