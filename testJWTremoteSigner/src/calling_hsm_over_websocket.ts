import * as didJWT from 'did-jwt'
import * as u8a from 'uint8arrays'
import * as EC from 'elliptic'
import * as http from 'http'
import * as WebSocket from 'ws'

/**************************websocket_example.js*************************************************/
const server = http.createServer();
const s = new WebSocket.Server({ server });

//***************this snippet gets the local ip of the node.js server. copy this ip to the client side code and add ':3000' *****
//****************exmpl. 192.168.56.1---> var sock =new WebSocket("ws://192.168.56.1:3000");*************************************

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  console.log('addr: '+add);
})

startWebSocketLoop();

// The websocket connection needs to persist to listen for/act on events
// These events are incoming and outgoing traffic
// There could be a promise, running with a websocket connection, that sends out data and listens for a response 

//***********************************************************************************************************
 // * Functionally I need to look like:
//  * 
 // * s.on('connection', function(ws,req) {
 // *       // ws.send('2'+curve+digestHex);
//  *       ws.send('2'+'1200'+'e2bc6e7c4223f5e2f2fd69736216e71348d122ae644ca8a0cca1d2598938b048');
//  *      /// replace below with function waitForSignature, which returns data     
//  *  ws.on('message',function message(data) {
 // *            console.log('received: %s', data); /// get the reponse of the signature
 // *      })
//  * )
//  **//

function startWebSocketLoop() {
   s.on('connection', function(ws,req) {
      
     sendMessage(ws);

  });
}

function sendMessage(ws) {
  ws.send('2'+'1200'+'e2bc6e7c4223f5e2f2fd69736216e71348d122ae644ca8a0cca1d2598938b048')
}

function getReply(ws) {
   //let reply = true;
   //return reply;
   const reply = new Promise((resolve,reject) => {
     if(err) {
       reject(err);
       return;
     }
     ws.on('message',function message(data) {
       return data;
     })
     resolve(data);
   });
}
