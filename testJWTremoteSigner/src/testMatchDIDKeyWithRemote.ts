import { encodeDIDfromHexString, compressedKeyInHexfromRaw, didKeyURLtoPubKeyHex } from 'did-key-creator'
import * as nist_weierstrauss from 'nist-weierstrauss'
import { fromString } from 'uint8arrays/from-string'
import { toString } from 'uint8arrays/to-string'
import {octetPoint} from 'nist-weierstrauss'

import * as http from 'http'
import * as WebSocket from 'websocket-stream'

const server = http.createServer();
const websocketServer = new WebSocket.Server({ server });

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  console.log('addr: '+add);
})

websocketServer.on('stream',function(stream,request) {
    //stream.read();
    stream.setEncoding('utf8');
    const did = 'did:key:zDnaerx9CtbPJ1q36T5Ln5wYt3MQYeGRG5ehnPAmxcf5mDZpv';

   setInterval(function(){
     (async function() {
    
        const newDID = await matchDIDKeyWithRemote(did,stream);
        console.log(newDID);
    
      })();
    },250);

})

server.listen(3000);

async function matchDIDKeyWithRemote(didkeyURL: string,stream: any) : Promise<string> {
    const compressedPublicKey = didKeyURLtoPubKeyHex(didkeyURL);
    const publicKey = nist_weierstrauss.nist_weierstrauss_common.publicKeyIntToUint8ArrayPointPair(nist_weierstrauss.secp256r1.ECPointDecompress(fromString(compressedPublicKey,'hex')))
    const publicRawKey = octetToRaw(publicKey)
    let result = await matchPublicKeyWithRemote(publicRawKey,stream)
    if(result.length > 1) {
      return rpcToDID(result);
     } else {
       return didkeyURL;
     }
  }

  function octetToRaw(publicKey: octetPoint) {
    return toString(publicKey.xOctet,'hex')+toString(publicKey.yOctet,'hex')
 }

 async function matchPublicKeyWithRemote(publicKey: string,stream: any) : Promise<string> {
    let rpcPayload = '0'+'1200'+publicKey;
    stream.write(rpcPayload);
   // console.log('rpcpaylod'+rpcPayload);
    let result = await waitForEvent(stream,'data');  
   // console.log('result is:'+result);
    return result; 
  }

  async function waitForEvent(emitter, event): Promise<string> {
    return new Promise((resolve, reject) => {
        emitter.once(event, resolve);
        emitter.once("error", reject);
        emitter.removeAllListeners("error");  /// I hope this is correct, it seems to stop the code from complaining about the maxListenerLimit being exceeded
    });
  }

  function rpcToDID(response) : string {
    let result = response.split(',');
    const multicodecName = 'p256-pub';
    return encodeDIDfromHexString(multicodecName,compressedKeyInHexfromRaw(result[1]))
}
