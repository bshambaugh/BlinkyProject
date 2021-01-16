var EC = require('elliptic').ec;

// Create and initialize EC context
// (better do it once and reuse it)
var ec = new EC('p256');

// I think that this public key is okay, because I looked other places...
var pub = { x: 'F9C36F8964623378BDC068D4BCE07ED17C8FA486F9AC0C2613CA3C8C306D7BB6', y: '1CD36717B8AC5E4FEA8AD23DC8D0783C2318EE4AD7A80DB6E0026AD0B072A24F' };

// Import public key
var key = ec.keyFromPublic(pub, 'hex');

// I need to make sure that this signature looks okay...
var signature = { r: 'D44D3708277329499AB833A315567DC97B201C948EC920BD1F9D7106D316AA85', s: 'A8347A7ED74B7F17C1F123D3DC36C4E83C4A006D42675994861DCDCDEC5AEDE9' }; // case 3

// ['D44D3708277329499AB833A315567DC97B201C948EC920BD1F9D7106D316AA85', 'A8347A7ED74B7F17C1F123D3DC36C4E83C4A006D42675994861DCDCDEC5AEDE9']
// I need to figure out how this messageHash looks...
var msgHash = '000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F';

// right now this key is false...
console.log(key.verify(msgHash, signature));
