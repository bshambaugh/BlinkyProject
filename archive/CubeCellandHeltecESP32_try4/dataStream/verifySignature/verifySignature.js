function verifySignature(message,signature,publicKey) {
 var EC = require('elliptic').ec;
 var ec = new EC('p256');
 x1 = publicKey.slice(0,((publicKey.length - 1)/2)+1);
 y1 = publicKey.slice(((publicKey.length - 1)/2+1),(publicKey.length));
 r1 = signature.slice(0,((signature.length - 1)/2 + 1));
 s1 = signature.slice(((signature.length - 1)/2 + 1),(signature.length));
 console.log("x1 is: "+x1);
 console.log("y1 is: "+y1);
 console.log("r1 is: "+r1);
 console.log("s1 is: "+s1);
 var pub = { x: x1,y: y1 };
 var key = ec.keyFromPublic(pub,'hex');
 var sig = { r: r1,s: s1 };
 console.log(key.verify(message,signature));
}

exports.verifySignature = verifySignature;

