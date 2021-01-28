let HashTable = require('./hashTable/HashTable.js');
let MinHeap = require('./MinHeap/MinHeap.js');
let crypto = require('./verifySignature/verifySignatureQ.js');
let hexToFloat = require('./hexIEEEtoFloat/hexIEEEtoFloat.js');
let toDB = require('./insertInDB/insertLux.js');

function splitMessage(str) {
  let  res = str.split(",");
  return res;
}


function insertIntoDatabase(string,heap,message_ht,publicKey_ht,signature_ht,table,database,host,user,password) {


     let result = splitMessage(string);
     console.log(result);
     console.log(result.length);

     if(heap.contains(result[0]) == false && result.length == 3) {
       console.log("insert into heap");
           heap.insert(result[0]);
     }
 
     if(result[1] == "message") {
       console.log("insert message into hash table");
         message_ht.add(result[0],result[2]);
     }
     if(result[1] == "signature") {
       console.log("insert signature into hash table");
       signature_ht.add(result[0],result[2]);
     }
     if(result[1] == "publicKey") {
       console.log("insert publicKey into hash table");
       publicKey_ht.add(result[0],result[2]);
     }

     verifyAndInsertIntoDatabase(heap,message_ht,publicKey_ht,signature_ht,table,database,host,user,password);

//      console.log(findMinMatch(heap,message_ht,publicKey_ht,signature_ht));
}

function findMinMatch(heap,message_ht,publicKey_ht,signature_ht) {
     for(i=0;i<heap.heap.length;i++) {
       let key = heap.getAtIndex(i);
       message=message_ht.search(key);
       signature=signature_ht.search(key);
       publicKey=publicKey_ht.search(key);
       if(message != null && signature != null && publicKey != null) {
         return {key,message,signature,publicKey};
       }
     }

}

function verifyAndInsertIntoDatabase(heap,message_ht,publicKey_ht,signature_ht,table,database,host,user,password) {
   let match = findMinMatch(heap,message_ht,publicKey_ht,signature_ht);
   if(match != null) {
    console.log(match);
    console.log(Object.keys(match));
    console.log(match.key);
    messageMATCH=match.message;
    signatureMATCH=match.signature;
    publicKeyMATCH=match.publicKey;
    keyMATCH=match.key;
    if(crypto.verifySignatureQ(messageMATCH,signatureMATCH,publicKeyMATCH)) {
      number = hexToFloat.parseFloat(messageMATCH);
      console.log("the number is: "+number);
      toDB.insertLux(number,table,database,host,user,password);
      console.log(keyMATCH);
      heap.remove(keyMATCH);
      message_ht.remove(keyMATCH);
      signature_ht.remove(keyMATCH);
      publicKey_ht.remove(keyMATCH);
/*      heap.remove(keyMATCH);
      message_ht.remove(keyMATCH);
      signature_ht.remove(keyMATCH);
      publicKey_ht.remove(keyMATCH); */ 
    }
   }
//   toDB.insertLux(15.0,table,database,host,user,password);
/*
      messageMATCH=match.message;
      signatureMATCH=match.signature;
      publicKeyMATCH=match.publicKey;
      keyMATCH=match.key;
      if(crypto.verifySignatureQ(messageMATCH,signatureMATCH,publicKeyMATCH)) {
	 if(message != null) {
	    number = hexToFloat.parseFloat(messageMATCH);
            console.log("the number is: "+number);
          toDB.insertLux(number,table,database,host,user,password);
            console.log(number);
	    heap.remove(key);
            message_ht.remove(key);
            signature_ht.remove(key);
            publicKey_ht.remove(key);	
	 }
      } 
 */
}

exports.insertIntoDatabase = insertIntoDatabase;
