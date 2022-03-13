/**************************websocket_example.js*************************************************/

//var bodyParser = require("body-parser");
//const express = require('express'); //express framework to have a higher level of methods
//const app = express(); //assign app variable the express class/method
var http = require('http');
//var path = require("path");
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());
//const server = http.createServer(app);//create a server
const server = http.createServer();

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
/*
app.get('/', function(req, res) {
res.sendFile(path.join(__dirname + '/index.html'));
});
*/

//*************************************************************************************************************************
//***************************ws chat server********************************************************************************

//app.ws('/echo', function(ws, req) {
s.on('connection',function(ws,req){

ws.on('close', function(){
console.log("lost one client");
});
ws.send("new client connected");
console.log("new client connected");

var interval = setInterval(function(){
  console.log('Hello World');
  ws.send("toggleLED");
}, 2000);


});

server.listen(3000);
