let HashTable = require('./hashTable/HashTable.js');
let MinHeap = require('./MinHeap/MinHeap.js');
let crypto = require('./verifySignature/verifySignatureQ.js');
let hexToFloat = require('./hexIEEEtoFloat/hexIEEEtoFloat.js');

var string = [[129,"signature","082960fea165a9473fa45364d080278be3eec1dcb4896a4a2eecaedd0ffbcaef8a1a051706934bfd015019ff872a7bd1c8c3948d953fa7ff5eb46e2e576de27a"],
[129,"publicKey","f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb61cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24f"],
[129,"message","416fffff00000000000000000000000000000000000000000000000000000000"],
[129,"message","416fffff00000000000000000000000000000000000000000000000000000000"],
[130,"signature","cb49cbc14fe58164e2ba36360c90bcf683f4c5fdf2978d983b4ec035fe1d320f5bded6827796a5baf3095ef325dd428e75073cd8dae39bd1bec77c0e008e37bd"],
[130,"publicKey","f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb61cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24f"],
[130,"message","416fffff00000000000000000000000000000000000000000000000000000000"],
[130,"message","416fffff00000000000000000000000000000000000000000000000000000000"],
[131,"signature","b248aea7a7e9e507c710e59de1d9c816920cd13dbade3a63323c0f88f4baf193059f3f37ae0a7478c35c5de1e0a47d8605eb16a37414406449e932d35556899a"],
[131,"publicKey","f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb61cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24f"],
[131,"message","416fffff00000000000000000000000000000000000000000000000000000000"],
[131,"message","416fffff00000000000000000000000000000000000000000000000000000000"],
[132,"signature","0a98d4c7d22e67d282856619afc266acbf2b756772d1a65142cda0ff6a7f09c31c2b40f458db373c13a23d3f71172b64420c0a4c86cafb93c29410ed272c0067"],
[132,"publicKey","f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb61cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24f"],
[132,"publicKey","f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb61cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24f"],
[132,"publicKey","f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb61cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24f"],
[132,"publicKey","f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb61cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24f"],
[132,"publicKey","f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb61cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24f"],
[133,"message","416fffff00000000000000000000000000000000000000000000000000000000"],
[133,"message","416fffff00000000000000000000000000000000000000000000000000000000"],
[133,"message","416fffff00000000000000000000000000000000000000000000000000000000"]];

const heapTwo = new MinHeap();
const message_ht = new HashTable();
const publicKey_ht = new HashTable();
const signature_ht = new HashTable();

for (let i = 0; i <  string.length; i++) {
   // I need to figure out how to avoid entering duplicates into the heap and hte hash tables

   if(heapTwo.contains(string[i][0]) == false) {
     heapTwo.insert(string[i][0]);
   }
   if(string[i][1] == "message") {
      message_ht.add(string[i][0],string[i][2]);
   }
   if(string[i][1] == "signature") {
      signature_ht.add(string[i][0],string[i][2]);
   }
   if(string[i][1] == "publicKey") {
      publicKey_ht.add(string[i][0],string[i][2]);
   }
}

console.log(message_ht);
console.log(signature_ht);
console.log(publicKey_ht);

console.log(heapTwo.heap);

/* If I contain a key, check to see if the signature and the public key work with the message */
console.log(heapTwo.contains(129));
console.log(message_ht.search(129));
console.log(signature_ht.search(129));
console.log(publicKey_ht.search(129));

console.log("here is the minumum of the heap");
console.log(heapTwo.getMin());
console.log("Here is the end of the minimum of the heap ... this should be the key");
let key = 129;
let message;
let signature;
let publicKey;

if(heapTwo.contains(key)) {
  console.log("I contain the key: "+key);
  message=message_ht.search(129);
  signature=signature_ht.search(129);
  publicKey=publicKey_ht.search(129);
  if(crypto.verifySignatureQ(message,signature,publicKey)) {
    console.log("the message is valid");
    console.log(hexToFloat.parseFloat(message)); 
    // I need to remove the key from the heap, the message, signature, and publicKey at the key from the hash tables
  } 
}

// ****** remove *******
heapTwo.remove(129);
message_ht.remove(129);
signature_ht.remove(129);
publicKey_ht.remove(129);

console.log(message_ht);
console.log(signature_ht);
console.log(publicKey_ht);

console.log(heapTwo.heap);

