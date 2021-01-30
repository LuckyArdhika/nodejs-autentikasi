const mysql = require('mysql');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nodeauth'
});

db.connect(function(err){
  if (err) throw err;
  console.log('database connected');
});

module.exports = db;