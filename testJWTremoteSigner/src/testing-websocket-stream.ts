import * as didJWT from 'did-jwt'
import * as u8a from 'uint8arrays'
import * as EC from 'elliptic'
import * as http from 'http'
//import * as WebSocket from 'ws'
import * as WebSocket from 'websocket-stream'

//import WebSocket, { createWebSocketStream, WebSocketServer } from 'ws';

/**************************websocket_example.js*************************************************/
const server = http.createServer();
const websocketServer = new WebSocket.Server({ server });

//***************this snippet gets the local ip of the node.js server. copy this ip to the client side code and add ':3000' *****

//****************exmpl. 192.168.56.1---> var sock =new WebSocket("ws://192.168.56.1:3000");*************************************
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  console.log('addr: '+add);
})

websocketServer.on('stream',function(stream,request) {
   //stream.read();
   stream.setEncoding('utf8');

})

async function getSignature(stream,payload) {
  let data = '2'+'1200'+payload;  // this is parsed to type+signature+payload when it gets to the ESP32
  stream.write(data);
  /*
  let data = '2'+'1200'+payload;  // this is parsed to type+signature+payload when it gets to the ESP32
  stream.write(data); // make sure they payload is sha256 hashed to make sure it isn't to much for the signer & network
  return new Promise((resolve,reject) => {
     stream.once('data',(resolve) => {
        // do code to take the resolve to make it a Base64URL
         return resolve;
    });
    stream.once('error',reject); // I threw this in for errors, it may not be correct. I saw it here: https://www.derpturkey.com/event-emitter-to-promise/
  }
  */
}



/*
function P256Signer(): Signer {    // signer like ed25519, secp256k1 signer in did-jwt
  return async(payload: string | Uint8Array): Promise<string> => {
        return await getSignature(payload);
  }
}
*/


/*
function writer(stream,string) {
    stream.write(string, () => console.log('I am a giraffe' ));
}
*/
/*
websocketServer.on('connection', function connection(ws) {
  const duplexWebSocketStream = WebSocket.createWebSocketStream(ws, { encoding: 'utf8' });
  duplexWebSocketStream.on('message',function message(data) {
           console.log('received: %s', data); /// get the reponse of the signature
  })
});
*/

server.listen(3000);
