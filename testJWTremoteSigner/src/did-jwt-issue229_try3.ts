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
   /*
   var interval = setInterval(function(){
    stream.write(string, () => console.log('I am a penguin' ));
   // writer(stream,string);
  }, 2000);
  */

setInterval(function(){
  (async function() {
    
    //stream.write(string);
    // getSignature(stream,string);
    let response = await getSignature(stream,string);
    // console.log("received",response);
    console.log(response);

    
    fs.appendFile('../data/duck.txt',response, (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
    });
    
    response = '';

  })();
},2000);

})

async function getSignature(stream,string) {
  stream.write(string);
  let result = await waitForEvent(stream,'data');
  //console.log(result);
  return result;
}

// I think that I have to close some listeners here....because I get to the maxListner limit
async function waitForEvent(emitter, event): Promise<string> {
  return new Promise((resolve, reject) => {
      emitter.once(event, resolve);
      emitter.once("error", reject);
      emitter.removeAllListeners("error");  /// I hope this is correct, it seems to stop the code from complaining about the maxListenerLimit being exceeded
  });
}


/*
async function waitForEvent<T>(emitter, event): Promise<T> {
  return new Promise((resolve, reject) => {
      emitter.once(event, resolve);
      emitter.once("error", reject);        
  });
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
