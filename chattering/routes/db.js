const mysql = require('mysql2')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'reactwebuser',
    password: 'reactwebpw',
    database: 'reactweb'
})

module.exports = connection