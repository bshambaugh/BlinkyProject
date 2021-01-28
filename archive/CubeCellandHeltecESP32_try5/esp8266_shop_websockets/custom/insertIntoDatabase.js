let HashTable = require('./hashTable/HashTable.js');
let MinHeap = require('./MinHeap/MinHeap.js');
let crypto = require('./verifySignature/verifySignatureQ.js');
let hexToFloat = require('./hexIEEEtoFloat/hexIEEEtoFloat.js');
let toDB = require('./insertInDB/insertLux.js');

function splitMessage(str) {
  let  res = str.split(",");
  return res;
}

function insertIntoDatabase(string,heap,message_ht,publicKey_ht,signature_ht,table,database,user,password) {

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
 
    verifyAndInsertIntoDatabase(heap,message_ht,publicKey_ht,signature_ht);
}

function verifyAndInsertIntoDatabase(heap,message_ht,publicKey_ht,signature_ht,table,database,user,password) {
   let key = heap.getMin();
   if(heap.contains(key)) {
      message=message_ht.search(key);
      signature=signature_ht.search(key);
      publicKey=publicKey_ht.search(key);
      if(crypto.verifySignatureQ(message,signature,publicKey)) {
	 if(message != null) {
	    number = hexToFloat.parseFloat(message);
            toDB.insertLux(number,table,database,host,user,password);
	    heap.remove(key);
            message_ht.remove(key);
            signature_ht.remove(key);
            publicKey_ht.remove(key);		 
	 }
      }
   }
}

exports.insertIntoDatabase = insertIntoDatabase;
