1. Use the function in the verifySignature Folder to verify signature coming from the ESP32, and later the CubeCell and forwarded through the ESP32 in the Node.js server code.
2. Follow https://eips.ethereum.org/EIPS/eip-2844 to take data to and from the ESP32 on the Node.js and interact with data going to and from a ceramic http client or ceramic core.

The code on the Node.js serve for interaction with Ceramic will look something like:
```
import {DID} from 'dids'
import KeyResolver from 'key-did-resolver'
import {Ed25519Provider} from 'key-did-provider-ed25519'  /// replace with something for P-256, P-384, P-521 .... etc
import {randomBytes} from '@stablelib/random'  /// not needed unless used for a nonce or something
// include did-jwt for verifiable cred or other library for nft (ceramic network makes assertions about did:key string)


// this stuff might be a bit beyond the scope
import { CeramicClient } from '@ceramicnetwork/http-client'
const API_URL = "https://ceramic-clay.3boxlabs.com"
const ceramic = new CeramicClient(API_URL)
//

const seed = randomBytes(32) // 32 bytes with high entropy   /// this line makes no sense for a remote signer
const provider = new Ed25519Provider(seed)   /// replace for provider for P-256, P-384, P-521 etc ... (signer is remote)

const did = new DID({ provider, resolver: KeyResolver.getResolver() })
const auth = await did.authenticate()
console.log('auth is')
console.log(auth) // this spits out the did:key

// see https://github.com/ceramicstudio/idx-assignment and https://github.com/ceramicstudio/js-glaze to create more documents

// create JWS ... specified in eip-2844 interface
const { jws, linkedBlock } = await did.createDagJWS({ hello: 'world' })

// create JWE ... specified in eip-2844 interface
const jwe = await did.createDagJWE({ very: 'secret' }, [did.id])

console.log('jwe is:');
console.log(jwe);

// decrypt JWE  ... ... specified in eip-2844 interface
const decrypted = await did.decryptDagJWE(jwe)

console.log('decrypted is:');
console.log(decrypted);

// this stuff may be a bit beyold the scope
ceramic.did = did
ceramic.did.setProvider(provider)
//
```

2.2. A separate did-provider like key-did-provider-weierstrauss or key-did-provider-P256(384,521) will need to be built to fully fit into the Node.js server code.
This code https://github.com/bshambaugh/key-did-creator-test was great for creating did:keys but it does not provide authentication, JWS creation, and JWE decryption
like ceramic expects for the EIP-2844 interface. 

2.3 The pull request https://github.com/ceramicnetwork/js-ceramic/pull/1884 will need to be merged so KeyResolver.getResolver works for P-256, P-384, and P-521.


