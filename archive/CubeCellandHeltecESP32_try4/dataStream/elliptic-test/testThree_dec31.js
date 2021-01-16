var EC = require('elliptic').ec;

// Create and initialize EC context
// (better do it once and reuse it)
var ec = new EC('p256');

// I think that this public key is okay, because I looked other places...
var pub = { x: 'f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb6', y: '1cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24f' };

// Import public key
var key = ec.keyFromPublic(pub, 'hex');

// I need to make sure that this signature looks okay...
var signature = { r: 'cb49cbc14fe58164e2ba36360c90bcf683f4c5fdf2978d983b4ec035fe1d320f', s: '5bded6827796a5baf3095ef325dd428e75073cd8dae39bd1bec77c0e008e37bd' }; // case 3

// ['D44D3708277329499AB833A315567DC97B201C948EC920BD1F9D7106D316AA85', 'A8347A7ED74B7F17C1F123D3DC36C4E83C4A006D42675994861DCDCDEC5AEDE9']
// I need to figure out how this messageHash looks...
var msgHash = '416fffff00000000000000000000000000000000000000000000000000000000';

// right now this key is false...
console.log(key.verify(msgHash, signature));

/*
Received: 130,signature,cb49cbc14fe58164e2ba36360c90bcf683f4c5fdf2978d983b4ec035fe1d320f 5bded6827796a5baf3095ef325dd428e75073cd8dae39bd1bec77c0e008e37bd
Received: 130,publicKey,f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb6 1cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24f
Received: 130,message,416fffff00000000000000000000000000000000000000000000000000000000
*/
