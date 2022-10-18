# did:key creator
This is a library for converting public keys to the did:key format

## Reference
This has been tested to create did:keys from the P-256,P-384, and P-521 curves specified in https://github.com/w3c-ccg/did-method-key
and https://w3c-ccg.github.io/did-method-key/ .

This code is available as the [**did-key-creator**](https://www.npmjs.com/package/did-key-creator) package on npm.

For other cryptographic curves, follow a similar pattern by feeding the correct multicodecName and corresponding public key, and check the result (or form) of creating a did:key against the test vectors in the specification. Try reverting the did:key to get the original public key. The encodeDIDfromBytes function in the library should be the most generic. Public keys that create did:keys should revert to the same public keys. The did_key_utils functions provided may or may not work with the desired key. Since did:keys are specified to involve compressed public keys, a decompression function will be needed to get the key back into a raw or uncompressed form if that allows for the best comparisons or use based on the output or desired inputs of the utilized cryptographic library, etc. At least the raw form (just the x,y bytes) and the uncompressed form with a '04' prefix concatenated to the x,y bytes was appropriate for the NIST (P-*) curves. If it looks different for different curves, this is to be determined. Of course when comparing the compressed to raw form for NIST, look at them serialized as a hex string with x,y points as big endian. Decompression functions for NIST expressed as a ECDecompress function can be found in the key-did-resolver npm package github src folder for secp256r1, secp384r1, and secp521r1 (https://github.com/ceramicnetwork/js-ceramic/). multicodecNames can be found here: https://github.com/multiformats/multicodec/blob/master/table.csv .

## Standard Use: 

### Note:
One way to get import in the code to work is to add "type":"module" in package.json .

### Compressed 33 Byte Key code example for P-256 key (using elliptic npm module):
```
import { rawKeyInHexfromUncompressed, compressedKeyInHexfromRaw, encodeDIDfromHexString, encodeDIDfromBytes } from 'did-key-creator'

import { fromString } from 'uint8arrays/from-string'
import elliptic from 'elliptic'

const ecurve = new elliptic.ec('p256')
const  key = ecurve.genKeyPair();
const  pubPoint = key.getPublic('hex');
const multicodecName = 'p256-pub';

const rawKey = rawKeyInHexfromUncompressed(pubPoint);
const compressedKey = compressedKeyInHexfromRaw(rawKey);

const publicKey2 = fromString(compressedKey,'base16');
console.log(encodeDIDfromHexString(multicodecName,compressedKey));
console.log(encodeDIDfromBytes(multicodecName,publicKey2));
```

### output
```
did:key:zDnaeqYWNxcFqy5DcJm91BMTeWv5hjs1VL5medk9n8dDUC67T
did:key:zDnaeqYWNxcFqy5DcJm91BMTeWv5hjs1VL5medk9n8dDUC67T
```

### Compressed 49 Byte Key code example for P-384 key (using elliptic npm module):
```
import { rawKeyInHexfromUncompressed, compressedKeyInHexfromRaw, encodeDIDfromHexString, encodeDIDfromBytes } from 'did-key-creator'
import elliptic from 'elliptic'

const ecurve = new elliptic.ec('p384')
const  key = ecurve.genKeyPair();
const  pubPoint = key.getPublic('hex');
const multicodecName = 'p384-pub';

const rawKey = rawKeyInHexfromUncompressed(pubPoint);
const compressedKey = compressedKeyInHexfromRaw(rawKey);

console.log(encodeDIDfromHexString(multicodecName,compressedKey));
```

### output
```
did:key:z82Lkz6GT5oNPzQowVWaYysnFPT1NAMsXayELmNjme3FhRErkTkij9ywuYWukxcLfNdW6Cw
```

### Compressed 67 Byte Key code example for P-521 key (using elliptic npm module):
```
import { rawKeyInHexfromUncompressed, compressedKeyInHexfromRaw, encodeDIDfromHexString, encodeDIDfromBytes } from 'did-key-creator'

import { fromString } from 'uint8arrays/from-string'
import elliptic from 'elliptic'

const ecurve = new elliptic.ec('p521')
const  key = ecurve.genKeyPair();
const  pubPoint = key.getPublic('hex');
const multicodecName = 'p521-pub';

const rawKey = rawKeyInHexfromUncompressed(pubPoint);
const compressedKey = compressedKeyInHexfromRaw(rawKey);

console.log(encodeDIDfromHexString(multicodecName,compressedKey));
```

### output
```
did:key:z2J9gaYmUxgiF1VDutBWwC4KVdpKfjnRkyV3t4kysx49eHz1wkYh1KHBPqbNdVH5GTgY2KLXtJPYTwFDkhQxuTWxK3K5HSKu
```

## Other Possible Uses (non-standard and will hurt interoperability):

### Raw 64 Byte Public Key code Example for P-256 Key:

```
import { encodeDIDfromHexString, encodeDIDfromBytes } from 'did-key-creator'
import { fromString } from 'uint8arrays/from-string'

const multicodecName = 'p256-pub';
const publicKeyHex = 'f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb61cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24f';
const publicKey = fromString(publicKeyHex,'base16');

console.log(encodeDIDfromHexString(multicodecName,publicKeyHex));
console.log(encodeDIDfromBytes(multicodecName,publicKey));

```

### output
```
did:key:zruuPojWkzGPb8sVc42f2YxcTXKUTpAUbdrzVovaTBmGGNyK6cGFaA4Kp7SSLKecrxYz8Sc9d77Rss7rayYt1oFCaNJ
did:key:zruuPojWkzGPb8sVc42f2YxcTXKUTpAUbdrzVovaTBmGGNyK6cGFaA4Kp7SSLKecrxYz8Sc9d77Rss7rayYt1oFCaNJ
```

### Raw 64 Byte Public Key code Example  for P-256 key (using elliptic npm module):
```
import { rawKeyInHexfromUncompressed, compressedKeyInHexfromRaw, encodeDIDfromHexString, encodeDIDfromBytes } from 'did-key-creator'
import { fromString } from 'uint8arrays/from-string'
import elliptic from 'elliptic'

const ecurve = new elliptic.ec('p256')
const  key = ecurve.genKeyPair();
const  pubPoint = key.getPublic('hex');
const multicodecName = 'p256-pub';

const rawKey = rawKeyInHexfromUncompressed(pubPoint);

const publicKey2 = fromString(rawKey,'base16');
console.log(encodeDIDfromHexString(multicodecName,rawKey));
console.log(encodeDIDfromBytes(multicodecName,publicKey2));
```

### output
```
did:key:zruqvMb8L2VWcghzg2Bt9QYwHnDfwixx9gKKU6Sy4pizM24cB98kFKefB8S7jYNvzyUFT5aRF1q7zEuMwR2RdszUDDc
did:key:zruqvMb8L2VWcghzg2Bt9QYwHnDfwixx9gKKU6Sy4pizM24cB98kFKefB8S7jYNvzyUFT5aRF1q7zEuMwR2RdszUDDc
```

### Uncompressed 65 Byte Key code example for P-256 key (using elliptic npm module):
```
import { rawKeyInHexfromUncompressed, compressedKeyInHexfromRaw, encodeDIDfromHexString, encodeDIDfromBytes } from 'did-key-creator'
import { fromString } from 'uint8arrays/from-string'
import elliptic from 'elliptic'

const ecurve = new elliptic.ec('p256')
const  key = ecurve.genKeyPair();
const  pubPoint = key.getPublic('hex');
const multicodecName = 'p256-pub'

const publicKey3 = fromString(pubPoint,'base16');
console.log(encodeDIDfromHexString(multicodecName,pubPoint));
console.log(encodeDIDfromBytes(multicodecName,publicKey3));

```

### output
```
did:key:z4oJ8bWfFMefRfFuNtDtu69bQyvaCpYh62thpGA9TWNZs614qDUfCdZ2KuZMEAFKXGACSo3Ws9FLZwscDGtLwThKFev44
did:key:z4oJ8bWfFMefRfFuNtDtu69bQyvaCpYh62thpGA9TWNZs614qDUfCdZ2KuZMEAFKXGACSo3Ws9FLZwscDGtLwThKFev44
```

## License

Apache-2.0 OR MIT
