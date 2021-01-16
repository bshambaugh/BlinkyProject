let HashTable = require('./hashTable/HashTable.js');
let MinHeap = require('./MinHeap/MinHeap.js');
let crypto = require('./verifySignature/verifySignatureQ.js');
let hexToFloat = require('./hexIEEEtoFloat/hexIEEEtoFloat.js');

const heap = new MinHeap();
const message_ht = new HashTable();
const publicKey_ht = new HashTable();
const signature_ht = new HashTable();

string = "131,signature,b248aea7a7e9e507c710e59de1d9c816920cd13dbade3a63323c0f88f4baf193059f3f37ae0a7478c35c5de1e0a47d8605eb16a37414406449e932d35556899a";

insertIntoDatabase(string,heap,message_ht,publicKey_ht,signature_ht);

function splitMessage(str) {
  let  res = str.split(",");
  return res;
}

function insertIntoDatabase(string,heap,message_ht,publicKey_ht,signature_ht) {

     let result = splitMessage(string);

     if(heap.contains(result[0]) == false) {
       heap.insert(result[0]);
     }
     if(result[1] == "message") {
       message_ht.add(result[0],result[2]);
     }
     if(result[1] == "signature") {
       signature_ht.add(result[0],result[2]);
     }
     if(result[1] == "publicKey") {
       publicKey_ht.add(result[0],result[2]);
     }
  /*   verifyAndInsertIntoDataBase(); */
    verifyAndInsertIntoDatabase(heap,message_ht,publicKey_ht,signature_ht);
}

function verifyAndInsertIntoDatabase(heap,message_ht,publicKey_ht,signature_ht) {
   console.log(heap.heap);
   let key = heap.getMin();
   console.log(key);
   if(heap.contains(key)) {
      console.log("I contain the key: "+key);
      message=message_ht.search(key);
      signature=signature_ht.search(key);
      publicKey=publicKey_ht.search(key);
      if(crypto.verifySignatureQ(message,signature,publicKey)) {
         console.log("this is true");
//	 console.log(message);
	 if(message != null) {
	    console.log(message);
	    console.log(hexToFloat.parseFloat(message));
	    // insert into database here... Fix insertLux so that it takes a Float instead of a String
            heap.remove(key);
            message_ht.remove(key);
            signature_ht.remove(key);
            publicKey_ht.remove(key);		 
	 }
      }
   }
}
