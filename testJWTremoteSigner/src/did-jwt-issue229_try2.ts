import * as didJWT from 'did-jwt'
import * as u8a from 'uint8arrays'
import * as EC from 'elliptic'
import * as http from 'http'
//import * as WebSocket from 'ws'
import * as WebSocket from 'websocket-stream'
import { Stream } from 'stream'
import * as fs from 'fs'

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

   const string = '2'+'1200'+'f958a'; 

   (async function() {
    let duck = await getSignature(string,stream);
    console.log("received", duck);
  
    // this will not work because I don't know if duck is a string
    /*
    fs.appendFile('../data/duck.txt',duck, (err) => {
     if (err) throw err;
     console.log('The file has been saved!');
   });
   */
    // grab the return value from getSignature and write it to a file... use something like fs
 })();
   
})

async function waitForEvent<T>(emitter, event): Promise<T> {
  return new Promise((resolve, reject) => {
      emitter.once(event, resolve);
      emitter.once("error", reject);        
  });
}

async function getSignature(name: string,stream) {
  stream.write(name);
  // I think the emitter once should be wrapped in a promise....
  let result = await waitForEvent(stream, 'data');
  return result;
}

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
