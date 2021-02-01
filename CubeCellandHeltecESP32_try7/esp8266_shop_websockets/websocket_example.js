// Declare the insert int database method (bshambaugh)
let intoDB = require('./custom/insertIntoDatabase.js');
let MinHeap = require('./custom/MinHeap/MinHeap.js');
let Test = require('./custom/test/test.js');
let pruneTempData = require('./custom/pruneTempData/pruneTempData');
let trimMapwHeap = require('./custom/trimMapwHeap/trimMapwHeap.js');

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
  const message_ht = new Map();
  const publicKey_ht = new Map();
  const signature_ht = new Map();

/* data storage size ******************************************************************************************/

  const p = 4;

//*************************************************************************************************************************
//***************************ws chat server********************************************************************************

//app.ws('/echo', function(ws, req) {
s.on('connection',function(ws,req){

/******* when server receives messsage from client trigger function with argument message *****/
ws.on('message',function(message){
console.log("Received: "+message);


intoDB.insertIntoDatabase(message,heap,message_ht,publicKey_ht,signature_ht,table,database,host,user,password);

// Test: Remove Elements
// console.log(Test);
Test.test(heap,message_ht,publicKey_ht,signature_ht);
// pruneTempData.pruneTempData(heap,message_ht,signature_ht,publicKey_ht);
pruneTempData.pruneTempData(heap,message_ht,signature_ht,publicKey_ht,p)
/*
Test.checkheap();
Test.checkhashtable();
*/
// ....
// prune data

trimMapwHeap.trimMapwHeap(message_ht,heap);
trimMapwHeap.trimMapwHeap(signature_ht,heap);
trimMapwHeap.trimMapwHeap(publicKey_ht,heap);


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
