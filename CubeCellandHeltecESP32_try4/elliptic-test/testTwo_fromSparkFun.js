var EC = require('elliptic').ec;

// Create and initialize EC context
// (better do it once and reuse it)
var ec = new EC('p256');

// I think that this public key is okay, because I looked other places...
var pub = { x: 'B40788288CFA71BA08E338E04A1768CC3ECD48A81152DD37A1C2557581BE4E7E', y: '789895F66DE71C9A36E6B0145D5067917C41B89920753A7DA1FBF55E8A65F58A'};

// Import public key
var key = ec.keyFromPublic(pub, 'hex');

// I need to make sure that this signature looks okay...
var signature = { r: '7D88C55A8904B47C67AD76BDE917E14F33D482D0D93DF5C53184A4AD8EFD6E97', s: 'CA6752CADCA782D48D8C8C83E1EA0735FEEE5A046E3F3D4706633482588D418D'}; // case 3

// I need to figure out how this messageHash looks...
var msgHash = '000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F';

// right now this key is false...
console.log(key.verify(msgHash, signature));
