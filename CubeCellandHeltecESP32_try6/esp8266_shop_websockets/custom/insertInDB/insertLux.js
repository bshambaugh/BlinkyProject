let query = require('./sql_query/insertsql.js');

function insertLux(lux,table,database,host,user,password) {

 // Source:  https://stackoverflow.com/questions/10645994/how-to-format-a-utc-date-as-a-yyyy-mm-dd-hhmmss-string-using-nodejs
 let dt = new Date().toISOString().
   replace(/T/, ' ').      // replace T with a space
   replace(/\..+/, '')     // delete the dot and everything after

 sql = 'INSERT INTO '+table+' VALUES (NULL, '+lux +', '+'\''+ dt+'\')';

 query.insertsql(sql,database,host,user,password);
}

exports.insertLux = insertLux;
