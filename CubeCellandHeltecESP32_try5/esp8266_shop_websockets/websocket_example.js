// Declare the insert int database method (bshambaugh)
let intoDB = require('./custom/insertIntoDatabase.js');
let HashTable = require('./custom/hashTable/HashTable.js');
let MinHeap = require('./custom/MinHeap/MinHeap.js');

/**************************websocket_example.js*************************************************/

var bodyParser = require("body-parser");
const express = require('express'); //express framework to have a higher level of methods
const app = express(); //assign app variable the express class/method
var http = require('http');
var path = require("path");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const server = http.createServer(app);//create a server

// Declare parameters to insert into the database (bshambaugh)
// database stuff that you pass in...
let table = 'BH1750';
let database = 'scandalux';
let host = 'localhost';
let user = 'user';
let password = 'password';

//***************this snippet gets the local ip of the node.js server. copy this ip to the client side code and add ':3000' *****
//****************exmpl. 192.168.56.1---> var sock =new WebSocket("ws://192.168.56.1:3000");*************************************
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  console.log('addr: '+add);
})

/**********************websocket setup**************************************************************************************/
//var expressWs = require('express-ws')(app,server);
const WebSocket = require('ws');
const s = new WebSocket.Server({ server });

//when browser sends get request, send html file to browser
// viewed at http://localhost:30000
app.get('/', function(req, res) {
res.sendFile(path.join(__dirname + '/index.html'));
});

/********* temporary data storage *****************************************************************************************/
  const heap = new MinHeap();
  const message_ht = new HashTable();
  const publicKey_ht = new HashTable();
  const signature_ht = new HashTable();

//*************************************************************************************************************************
//***************************ws chat server********************************************************************************

//app.ws('/echo', function(ws, req) {
s.on('connection',function(ws,req){

/******* when server receives messsage from client trigger function with argument message *****/
ws.on('message',function(message){
console.log("Received: "+message);

intoDB.insertIntoDatabase(message,heap,message_ht,publicKey_ht,signature_ht,table,database,user,password);

s.clients.forEach(function(client){ //broadcast incoming message to all clients (s.clients)
if(client!=ws && client.readyState ){ //except to the same client (ws) that sent this message
client.send("broadcast: " +message);
}
});
// ws.send("From Server only to sender: "+ message); //send to client where message is from
});
ws.on('close', function(){
console.log("lost one client");
});
//ws.send("new client connected");
console.log("new client connected");
});
server.listen(3000);
