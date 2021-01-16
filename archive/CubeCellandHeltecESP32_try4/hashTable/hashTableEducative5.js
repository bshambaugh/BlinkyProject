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

  remove(key) {
     const hash = this.calculateHash(key);
     if (this.values.hasOwnProperty(hash) && this.values[hash].hasOwnProperty(key)) {
        delete this.values[hash][key];
	this.length = this.length - 1;
        return true;
     } else {
        return false;
     }
  }

}

//create object of type hash table
const message_ht = new HashTable();
const publicKey_ht = new HashTable();
const signature_ht = new HashTable();
//add data to the hash table ht
signature_ht.add("131", "b248aea7a7e9e507c710e59de1d9c816920cd13dbade3a63323c0f88f4baf193059f3f37ae0a7478c35c5de1e0a47d8605eb16a37414406449e932d35556899a");
publicKey_ht.add("131", "f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb61cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24f");
message_ht.add("131", "416fffff00000000000000000000000000000000000000000000000000000000");
message_ht.add("132","516fffff00000000000000000000000000000000000000000000000000000000");
message_ht.add("133","616fffff00000000000000000000000000000000000000000000000000000000");

console.log(message_ht.search("131"));
console.log(signature_ht.search("131"));
console.log(publicKey_ht.search("131"));

console.log(message_ht);
console.log(message_ht.length);
message_ht.remove("132");
console.log(message_ht);
console.log(message_ht.length);
