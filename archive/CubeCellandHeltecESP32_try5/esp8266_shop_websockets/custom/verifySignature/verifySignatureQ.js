function verifySignatureQ(message,signature,publicKey) {

var EC = require('elliptic').ec;

var ec = new EC('p256');

if( message != null && signature != null && message != null) {
r1 = signature.slice(0,((signature.length - 1)/2 + 1));
s1 = signature.slice(((signature.length - 1)/2 + 1),(signature.length));

x1 = publicKey.slice(0,((publicKey.length - 1)/2)+1);
y1 = publicKey.slice(((publicKey.length - 1)/2+1),(publicKey.length));

let pub = {x: x1, y: y1};
let key = ec.keyFromPublic(pub, 'hex');
let sig = { r: r1, s: s1 };

return key.verify(message, sig);
} else {
  return false;
}
}

exports.verifySignatureQ = verifySignatureQ;

