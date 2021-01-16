let lumensSensor = require('./util/split_string_fn.js');
let query = require('./sql_query/insertsql.js');

function insertLux(string,table,database,host,user,password) {

 // Source:  https://stackoverflow.com/questions/10645994/how-to-format-a-utc-date-as-a-yyyy-mm-dd-hhmmss-string-using-nodejs
 let dt = new Date().toISOString().
   replace(/T/, ' ').      // replace T with a space
   replace(/\..+/, '')     // delete the dot and everything after

 lux = lumensSensor.grabLumens(string);

 sql = 'INSERT INTO '+table+' VALUES (NULL, '+lux +', '+'\''+ dt+'\')';

 query.insertsql(sql,database,host,user,password);
}

exports.insertLux = insertLux;
