// Configuration details for connecting to MySQL database
module.exports = {
  connectionLimit : 10,
  host            : 'indaba-1.c0ib6xevgq1s.us-east-1.rds.amazonaws.com',
  user            : 'indabaAdmin',
  password        : 'abadni619',
  database        : 'indaba_db',
  port            : 3306,
  waitForConnections: true,
  queueLimit: 0
};