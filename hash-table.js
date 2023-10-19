const sha256 = require('js-sha256');

class KeyValuePair {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.next = null;
  }
}

class HashTable {

  constructor(numBuckets = 4) {
    this.count = 0;
    this.capacity = numBuckets;
    this.data = new Array(this.capacity).fill(null);
  }

  hash(key) {
    let hash256 = sha256(key).slice(0, 8);
    let newHash = parseInt(hash256, 16);

    return newHash;

  }

  hashMod(key) {
    return this.hash(key) % this.data.length;
  }

  insertNoCollisions(key, value) {
    // create hash from key
    const hashKey = this.hashMod(key);

    // check if index is already filled, if so throw error
    if (this.data[hashKey] !== null) {
      throw new Error('hash collision or same key/value pair already exists!');
    } else {
      // create key-value pair object
    const keyPair = new KeyValuePair(key, value);

    // insert key value pair at hashed index and increase count
    this.data[hashKey] = keyPair;
    this.count++;
    };

  }

  insertWithHashCollisions(key, value) {
    const hashKey = this.hashMod(key);

    if (!this.data[hashKey]) {
      // create key-value pair object
    const keyPair = new KeyValuePair(key, value);

    // insert key value pair at hashed index and increase count
    this.data[hashKey] = keyPair;
    this.count++;
    }
    else {
      // create key-value pair object and adjust its next to current head
      let keyPair = new KeyValuePair(key, value);
      keyPair.next = this.data[hashKey];

      // insert new key-value pair
      this.data[hashKey] = keyPair;
      this.count++;
    }
  }

  insert(key, value) {
    let keyPair = new KeyValuePair(key, value);
    let hashKey = this.hashMod(key);

    // handle empty buckets
    if (!this.data[hashKey]) {
      this.data[hashKey] = keyPair;
      this.count++;
      return;
    }

    // handle occupied buckets by check if new entry or updated value
    // check if key already exists in list, if so update value and return
    let current = this.data[hashKey];
    while (current) {
      if (keyPair.key === current.key) {
        current.value = keyPair.value;
        return;
      }
      current = current.next;
    }

    // if unique key, insert keyPair at head of list
    keyPair.next = this.data[hashKey];
    // insert new key-value pair
    this.data[hashKey] = keyPair;
    this.count++;

  }

}


module.exports = HashTable;
