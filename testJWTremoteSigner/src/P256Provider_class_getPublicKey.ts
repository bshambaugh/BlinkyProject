import { Signer } from 'did-jwt'
import { createJWS } from 'did-jwt'
import stringify from 'fast-json-stable-stringify'
import type {
  AuthParams,
  CreateJWSParams,
  DIDMethodName,
  DIDProviderMethods,
  DIDProvider,
  GeneralJWS,
} from 'dids'
import { RPCError, createHandler } from 'rpc-utils'
import type { HandlerMethods, RPCRequest, RPCResponse, SendRequestFunc } from 'rpc-utils'
import { encodeDIDfromHexString, compressedKeyInHexfromRaw, didKeyURLtoPubKeyHex } from 'did-key-creator'
import { fromString } from 'uint8arrays/from-string'
import { toString } from 'uint8arrays/to-string'
import * as u8a from 'uint8arrays'
import * as http from 'http'
import * as WebSocket from 'websocket-stream'

import KeyResolver from '@ceramicnetwork/key-did-resolver'
import { DID } from 'dids'

const server = http.createServer();
const websocketServer = new WebSocket.Server({ server });

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  console.log('addr: '+add);
})

websocketServer.on('stream',function(stream,request) {
    //stream.read();
    stream.setEncoding('utf8');
//const did = 'did:key:zDnaerx9CtbPJ1q36T5Ln5wYt3MQYeGRG5ehnPAmxcf5mDZpv';
const did = 'did:key:zDnaezUFn4zmNoNeZvBEdVyCv6MVL69X8NRD8YavTCJWGuXM7';
/*
const provider = P256Provider.build(stream,did);
console.log(provider);
*/
setInterval(function(){
  (async function() {
    
          const publicKey = await getPublicKey(stream);
     
          console.log('public Key is:');
          console.log(publicKey);  /// this is great, but I just need to stuff after the comma
    
    
  })();
},250);

})

server.listen(3000);

   // I think that I have to close some listeners here....because I get to the maxListner limit
   async function waitForEvent(emitter, event): Promise<string> {
    return new Promise((resolve, reject) => {
        emitter.once(event, resolve);
        emitter.once("error", reject);
        emitter.removeAllListeners("error");  /// I hope this is correct, it seems to stop the code from complaining about the maxListenerLimit being exceeded
    });
  }  

  async function getPublicKey(stream) : Promise<string> {
    /// look at the RPC call to get the public key
    let rpcPayload = '1'+'1200';
    stream.write(rpcPayload);
    let preResult = await waitForEvent(stream,'data');
    console.log(preResult);
    let result = preResult.split(',');
    return result[1];
  }

  