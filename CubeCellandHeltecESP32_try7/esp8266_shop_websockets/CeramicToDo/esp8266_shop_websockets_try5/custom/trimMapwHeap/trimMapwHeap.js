function trimMapwHeap(map,heap) {
   for (let key of map.keys()) {
     if(!heap.contains(key)) {
        map.delete(key);
     }
  }
}

exports.trimMapwHeap = trimMapwHeap;
