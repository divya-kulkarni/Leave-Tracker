const mysql = require("mysql");
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: 3306,
    password:'password',
    database:'risk_management',
    multipleStatements: true
});

module.exports = connection;
