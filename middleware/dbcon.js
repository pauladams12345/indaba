var mysql =       require('mysql'),
    session =     require('express-session'),
    MySQLStore =  require('express-mysql-session')(session);

var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'indaba-1.c0ib6xevgq1s.us-east-1.rds.amazonaws.com',
  user            : 'indabaAdmin',
  password        : 'abadni619',
  database        : 'indaba_db',
  PORT            : 3306
});

//error handling for database connection: https://www.w3resource.com/node.js/nodejs-mysql.php#Error_handling
pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.');
        }
    }

    if (connection) {
      connection.release();
    }

    return;
})

var sessionStore = new MySQLStore({}, pool);

module.exports.sessionStore = sessionStore;
module.exports.pool = pool;