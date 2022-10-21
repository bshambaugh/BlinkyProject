import { Signer } from 'did-jwt'
import { createJWS } from 'did-jwt'
import stringify from 'fast-json-stable-stringify'

import type {
  GeneralJWS,
  AuthParams
} from 'dids'

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
       did_authenticate: async ({ did, stream }, params: AuthParams) => {
        const response = await sign(
          {
            did,
            aud: params.aud,
            nonce: params.nonce,
            paths: params.paths,
            exp: Math.floor(Date.now() / 1000) + 600, // expires 10 min from now
          },
          stream,
          did
        )
        return toGeneralJWS(response)
      }
    


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

  const sign = async (
    payload: Record<string, any> | string,
    stream,
    did: string,
    protectedHeader: Record<string, any> = {}
  ) => {
    const kid = `${did}#${did.split(':')[2]}`
    const signer = remoteP256Signer(stream) // see remoteP256Signer.ts // const signer = EdDSASigner(secretKey)
    const header = toStableObject(Object.assign(protectedHeader, { kid, alg: 'ES256' }))  /// see https://datatracker.ietf.org/doc/html/rfc7518
    return createJWS(typeof payload === 'string' ? payload : toStableObject(payload), signer, header)
  }
  
  function toStableObject(obj: Record<string, any>): Record<string, any> {
    return JSON.parse(stringify(obj)) as Record<string, any>
  }

  function toGeneralJWS(jws: string): GeneralJWS {
    const [protectedHeader, payload, signature] = jws.split('.')
    return {
      payload,
      signatures: [{ protected: protectedHeader, signature }],
    }
  }
