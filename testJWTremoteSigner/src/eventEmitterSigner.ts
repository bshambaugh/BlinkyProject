//This follows the blog post: https://www.derpturkey.com/event-emitter-to-promise/
import * as  EventEmitter from 'events'
import { fromString } from 'uint8arrays/from-string';
import * as u8a from 'uint8arrays'
import * as EC from 'elliptic'
import * as fs from 'fs'

var ec = new EC.ec('p256');

    // create an event emitter
const emitter = new EventEmitter.EventEmitter();

// this prints out world every two seconds
setInterval(function(){
    const string = '2'+'1200'+'f958a';
    (async function() {
       let duck = await getSignature(string);
       console.log("received", duck);
      // fs.writeFileSync('../data/duck.txt',duck); // actually this needs to be an asynchronous function....
      // fs.writeFile()
       fs.appendFile('../data/duck.txt',duck, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
      });
       // grab the return value from getSignature and write it to a file... use something like fs
    })();
},2000)

function waitForEvent<T>(emitter, event): Promise<T> {
    return new Promise((resolve, reject) => {
        emitter.once(event, resolve);
        emitter.once("error", reject);        
    });
}

async function getSignature(name: string) {
    emitter.emit("greet", name)
    // I think the emitter once should be wrapped in a promise....
    let result = await waitForEvent(emitter, "greet");
    let resultTwo = callToHSM(result);
    return resultTwo;
}


function callToHSM(value): string {
    const privateKey = '0x040f1dbf0a2ca86875447a7c010b0fc6d39d76859c458fbe8f2bf775a40ad74a'
    const keypairTemp = ec.keyFromPrivate(privateKey)
    const buffferMsg = Buffer.from(value)
    let hexSig = keypairTemp.sign(buffferMsg)
    const xOctet = u8a.fromString(hexSig.r.toString(),'base10');
    const yOctet = u8a.fromString(hexSig.s.toString(),'base10');
    const hexR = u8a.toString(xOctet,'base16');
    const hexS = u8a.toString(yOctet,'base16');
     
    return hexR+hexS;
    //return u8a.fromString(hexR+hexS,'hex');
}
