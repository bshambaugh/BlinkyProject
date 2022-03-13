/**************************websocket_example.js*************************************************/

var http = require('http');
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
  ws.send("getSignature");
  ws.send("getPublicKey");
}, 2000);

ws.on('message', function message(data) {
  console.log('received: %s', data);
});

});

server.listen(3000);
