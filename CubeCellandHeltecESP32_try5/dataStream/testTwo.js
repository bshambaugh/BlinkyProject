let HashTable = require('./hashTable/HashTable.js');
let MinHeap = require('./MinHeap/MinHeap.js');

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

console.log(string[0][0]);
console.log(string[0][1]);
console.log(string[0][2]);
console.log("---------------");
console.log(string[1][0]);
console.log(string[1][1]);
console.log(string[1][2]);

// loop through array
console.log(string.length);
console.log(string[string.length-1][2]);

console.log("break");

const heapTwo = new MinHeap();
const message_ht = new HashTable();
const publicKey_ht = new HashTable();
const signature_ht = new HashTable();

for (let i = 0; i <  string.length; i++) {
   console.log(string[i][0]);
   // I need to figure out how to avoid entering duplicates into the heap and hte hash tables
   heapTwo.insert(string[i][0]);
   if(string[i][1] == "message") {
      console.log("I have a message");
      message_ht.add(string[i][0],string[i][2]);
   }
   if(string[i][1] == "signature") {
      console.log("I have a signature");
      signature_ht.add(string[i][0],string[i][2]);
   }
   if(string[i][1] == "publicKey") {
      console.log("I have a Public Key");
      publicKey_ht.add(string[i][0],string[i][2]);
   }
}

console.log(message_ht);
console.log(signature_ht);
console.log(publicKey_ht);

console.log(heapTwo.heap);

const message_ht2 = new HashTable();
message_ht2.add("131", "416fffff00000000000000000000000000000000000000000000000000000000");
console.log(message_ht2.search("131"));

const heapOne = new MinHeap();

heapOne.insert(5);
heapOne.insert(7);
heapOne.insert(2);

console.log(heapOne.getMin());
console.log(heapOne.heap.indexOf(7));
console.log(heapOne.heap.indexOf(5));
console.log(heapOne.heap);

console.log(heapOne.heap[0]);
console.log(heapOne.heap[1]);
console.log(heapOne.heap[2]);
console.log(heapOne.heap[3]);

console.log("length before: "+heapOne.heap.length);

heapOne.remove(2);

console.log("length after: "+ heapOne.heap.length);

