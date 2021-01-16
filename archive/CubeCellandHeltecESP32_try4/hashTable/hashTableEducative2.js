class HashTable {
  constructor() {
    this.values = {};
    this.length =  0;
    this.size =  0;
  }

  calculateHash(key) {
    return key.toString().length % this.size;
  }

  add(key, value) {
    const hash = this.calculateHash(key);
    if (!this.values.hasOwnProperty(hash)) {
      this.values[hash] = {};
    }
    if (!this.values[hash].hasOwnProperty(key)) {
       this.length++;
    }
    this.values[hash][key] = value;
  }

  search(key) {
     const hash = this.calculateHash(key);
     if (this.values.hasOwnProperty(hash) && this.values[hash].hasOwnProperty(key)) {
       return this.values[hash][key];
     } else {
       return null;
     }
  }
}

//create object of type hash table
const ht = new HashTable();
//add data to the hash table ht
ht.add("message", "b248aea7a7e9e507c710e59de1d9c816920cd13dbade3a63323c0f88f4baf193059f3f37ae0a7478c35c5de1e0a47d8605eb16a37414406449e932d35556899a");
ht.add("publicKey", "f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb61cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24f");
ht.add("signature", "416fffff00000000000000000000000000000000000000000000000000000000");

console.log(ht.search("message"));
console.log(ht.search("publicKey"));
console.log(ht.search("signature"));
