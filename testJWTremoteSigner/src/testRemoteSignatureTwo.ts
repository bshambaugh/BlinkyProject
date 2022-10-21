import { Signer } from 'did-jwt'

import * as http from 'http'
import * as WebSocket from 'websocket-stream'

const server = http.createServer();
const websocketServer = new WebSocket.Server({ server });

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  console.log('addr: '+add);
})

websocketServer.on('stream',function(stream,request) {
   const string = 'hell';
   setInterval(function(){
     (async function() {
    
      console.log(remoteP256Signer(stream));

      })();
    },250);

})

server.listen(3000);

async function getSignature(stream,string) {
    stream.write('2'+'1200'+string);
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

  function remoteP256Signer(stream): Signer {
    return async (payload: string | Uint8Array): Promise<string> => {
      return await getSignature(stream,payload);
     }
  }

