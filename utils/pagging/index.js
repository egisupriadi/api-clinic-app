const db = require('../../config/database')

module.exports = (table_name, page, limit, condition = "") => {
    return new Promise((resolve, reject) => {
        if (!table_name || !page || !limit) reject(false)
        const sql = `SELECT count(*) as cnt FROM ${table_name} ${condition ? `WHERE ${condition}` : ''}`
        db.query(sql, (error, [result]) => {
            if (error) {
                reject(error)
            }
            let total = result.cnt
            let data = {
                prev: page > 1 ? page - 1 : null,
                next: page * limit < total ? page + 1 : null,
                max: Math.ceil(total / limit),
            }

            resolve(data)
        })
    })
}