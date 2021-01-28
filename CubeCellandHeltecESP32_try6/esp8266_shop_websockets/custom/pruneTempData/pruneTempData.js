/*
function pruneTempData(heapTwo,message_ht,signature_ht,publicKey_ht) {
   let p = 5;
   if(heapTwo.heap.length+1 > p) {
     for(let x = 1; x < heapTwo.heap.length - p; x++) {
         key = heapTwo.heap[x];
         heapTwo.remove(key);
         message_ht.remove(key);
         signature_ht.remove(key);
         publicKey_ht.remove(key);
     }
   }
}
*/

function pruneTempData(heapTwo,message_ht,signature_ht,publicKey_ht) {
  let p = 5;
   if(heapTwo.heap.length+1 > p) {
     for(let x = 1; x < heapTwo.heap.length - p; x++) {
         key = heapTwo.heap[x];
         console.log(heapTwo.contains(key));
         console.log(message_ht.search(key));
         console.log(signature_ht.search(key));
         console.log(publicKey_ht.search(key));
     }
   } 
}

exports.pruneTempData = pruneTempData;
