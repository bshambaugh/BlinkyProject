import * as didJWT from 'did-jwt'
import * as u8a from 'uint8arrays'
import * as EC from 'elliptic'
import * as http from 'http'
//import * as WebSocket from 'ws'
import WebSocketStream, * as WebSocket from 'websocket-stream'

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
 
   const payload = 'f958a'; 
   var interval = setInterval(function(){
  /*
   (async () => {
    console.log(await writer(stream,payload))
   })()
   */
   writer(stream,payload).then(data => {
    console.log('the data is',data);
   });
  }, 2000);
 
})

async function writer(stream,payload) {
    stream.setEncoding('utf8');
    let data = '';
    let string = '2'+'1200'+payload;
    stream.write(string,() => console.log('I am a penguin'));  
    stream.on('data',(chunk) => {
      console.log('the chunk is',chunk);
      console.log(`Received ${chunk.length} bytes of data.`);
      data = chunk.toString();
      //data += chunk;  // see: https://nodesource.com/blog/understanding-streams-in-nodejs/
      // I am not sure how to store the chunk of data from the stream to a variable .. data has no value
      //chunk = '';
    })
    return data;
}

/*
websocketServer.on('connection', function connection(ws) {
  const duplexWebSocketStream = WebSocket.createWebSocketStream(ws, { encoding: 'utf8' });
  duplexWebSocketStream.on('message',function message(data) {
           console.log('received: %s', data); /// get the reponse of the signature
  })
});
*/

server.listen(3000);
