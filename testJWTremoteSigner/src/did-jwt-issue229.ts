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

   const string = '2'+'1200'+'f958a'; 
   var interval = setInterval(function(){
    stream.write(string, () => console.log('I am a penguin' ));
   // writer(stream,string);
  }, 2000);
 
  let result = '';
   // stream.write('hello');
   stream.on('data', (chunk) => {
    // this buffer gets overflowed... (the signature keeps getting longer and longer)
    console.log(`Received ${chunk.length} bytes of data.`);
    //result = chunk;
    console.log(chunk);
  });
  //console.log('the result is:',result);  
   console.log('something is going on');
})

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
