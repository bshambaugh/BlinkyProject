function pruneTempData(heapTwo,message_ht,signature_ht,publicKey_ht,p) {
   if(heapTwo.heap.length+1 > p) {
     for(let x = 1; x < heapTwo.heap.length - p; x++) {
         key = heapTwo.heap[x];
         heapTwo.remove(key);
     }
   }
}

exports.pruneTempData = pruneTempData;
