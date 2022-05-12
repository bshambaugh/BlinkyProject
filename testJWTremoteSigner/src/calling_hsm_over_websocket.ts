import * as didJWT from 'did-jwt'
import * as u8a from 'uint8arrays'
import * as EC from 'elliptic'
import * as http from 'http'
import * as WebSocket from 'ws'
//import WebSocket, { createWebSocketStream, WebSocketServer } from 'ws';

/**************************websocket_example.js*************************************************/
const server = http.createServer();
const websocketServer = new WebSocket.Server({ server });

//***************this snippet gets the local ip of the node.js server. copy this ip to the client side code and add ':3000' *****

//****************exmpl. 192.168.56.1---> var sock =new WebSocket("ws://192.168.56.1:3000");*************************************
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  console.log('addr: '+add);
})


websocketServer.on('connection', function connection(ws) {
  console.log("client connected");
  const duplexWebSocketStream = WebSocket.createWebSocketStream(ws, { encoding: 'utf8' });
  duplexWebSocketStream.write('2'+'1200'+'e2bc6e7c4223f5e2f2fd69736216e71348d122ae644ca8a0cca1d2598938b048');
  duplexWebSocketStream.write("01200f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb61cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24fa");
  duplexWebSocketStream.on('message',function message(data) {
           console.log('received: %s', data); /// get the reponse of the signature
  })
});

server.listen(3000);

/*
s.on('connection',function(ws,req){

ws.on('close', function(){
console.log("lost one client");
});
ws.send("new client connected");
console.log("new client connected");

var interval = setInterval(function(){
  console.log('Hello World');
  ws.send("01200f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb61cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24fa");
  ws.send("11200");
  ws.send("11200f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb61cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24f");
  ws.send("20000f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb61cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24f");
  ws.send("getSignature");
  ws.send("getPublicKey");
}, 2000);

ws.on('message', function message(data) {
  console.log('received: %s', data);
});
*/

/*
function bytesToBase64url(b: Uint8Array) {
  return u8a.toString(b, 'base64url')
}

export function callToHSM(value: string): Uint8Array {
    // call websocket connection to get signature
    // ws.send("21200f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb61cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24f");
    // const response = (ws.on('message', function message(data) { return data; });)
    return u8a.fromString(response,'hex');
}

export function signer (value: string): any { 
  return (): any=> {
   return bytesToBase64url(callToHSM(value))
  }
}

export async function JsonWebTokenT(value: string): Promise<string> {

  const signerWithPresetValue = signer(value)

  return didJWT.createJWT(
    { aud: 'did:ethr:0xf3beac30c498d9e26865f34fcaa57dbb935b0d74', exp: 1957463421, name: 'uPort Developer' },
    { issuer: 'did:ethr:0xf3beac30c498d9e26865f34fcaa57dbb935b0d74', signer: signerWithPresetValue }//,
   // { alg: 'ES256' }
 )
}



//startWebSocketLoop();

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
/*
function startWebSocketLoop() {
   s.on('connection', function(ws,req) {
      
     requestSignature(ws);
     // wrap this code below in asynchronous code
     await getSignedData(ws);
  });
}

function requestSignature(ws) {
  ws.send('2'+'1200'+'e2bc6e7c4223f5e2f2fd69736216e71348d122ae644ca8a0cca1d2598938b048')
}

async function getSignedData(ws) {
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
*/
