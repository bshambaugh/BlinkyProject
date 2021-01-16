var mysql = require('mysql');

function insertsql(sql,db,host,user,password) {

var con = mysql.createConnection({
  host: host,
  user: user,
  password: password,
  database: db
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Result: " + JSON.stringify(result));
  });
});
}

exports.insertsql = insertsql;
