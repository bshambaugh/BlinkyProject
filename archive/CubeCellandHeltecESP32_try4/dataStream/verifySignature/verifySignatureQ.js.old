function verifySignatureQ(message,signature,publicKey) {

var EC = require('elliptic').ec;

var ec = new EC('p256');

var sig = "cb49cbc14fe58164e2ba36360c90bcf683f4c5fdf2978d983b4ec035fe1d320f5bded6827796a5baf3095ef325dd428e75073cd8dae39bd1bec77c0e008e37bd";
var publicKey = "f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb61cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24f";
r1 = sig.slice(0,((sig.length - 1)/2 + 1));
s1 = sig.slice(((sig.length - 1)/2 + 1),(sig.length));

x1 = publicKey.slice(0,((publicKey.length - 1)/2)+1);
y1 = publicKey.slice(((publicKey.length - 1)/2+1),(publicKey.length));

var pub = {x: x1, y: y1};
var key = ec.keyFromPublic(pub, 'hex');
var signature = { r: r1, s: s1 };
var msgHash = '416fffff00000000000000000000000000000000000000000000000000000000';

return key.verify(msgHash, signature);
}

exports.verifySignatureQ = verifySignatureQ;

