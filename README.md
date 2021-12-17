## Possible Use Cases
There are two guys: Joe and Sam. Joe has a few ESP32 devices with various sensors and widgets attached. So does Sam. Sam is getting to know Joe, and would like to provide him access to some sensors. He also wants to store his sensor data in a distributed way because he doesn't trust the big cloud providers. He also like the immutable web of trust, but does not want to settle on a particular blockchain. Sam creates a ceramic document that gives Joe access to the data come from  some his sensors and widgets, and even to an even fewer number he gives Joe to ability to turn on and off the sensor or the widget.

In another use case a teacher is teaching a training class and wants to give pupils access to lockers and equipment (golf carts, power tools)  and rooms to stay they night , but does not want the hassle dealing with physical keys. The teacher just wants things to work once the pupil satisfactorily completes the training. For this did-jwt-vc is considered.

In another use case someone thinks it would be great to have augmented reality where the holder of an NFT is able to unlock gates, grab an electronically enabled unicorn plush toy from the stuffed animal vendor, or who knows...

Ramblings ...
"People are good at verifying digital credentials with computers and cell phones, but not so much if you want to open a gate or do it over a low bandwidth extended network.
Brent Shambaugh  10 minutes ago
I haven't seen many electronics projects associated with NFTs either.
Brent Shambaugh  9 minutes ago
NFTs seem to be totally a digital construct, like a picture of a dog, cryptographically verified to an owner....but they are not cryptographically verified to an electronic device in the physical dog collar
Brent Shambaugh  7 minutes ago
the dog collar cannot make cryptographically provable assertions about any health care its had, who his or her parents and siblings are .... etc...
Brent Shambaugh  6 minutes ago
For the longest time there have been hardware wallets for Bitcoin.
Brent Shambaugh  6 minutes ago
Maybe I am just reinventing the wheel around this.
Brent Shambaugh  8 minutes ago
I don't know. I've learned a lot. 
"
Interesting, ERC-721 (non-fungible tokens)  mentions physical assets: https://eips.ethereum.org/EIPS/eip-721

## Rough draft

This is the present Node.js server code https://github.com/bshambaugh/BlinkyProject/tree/master/CubeCellandHeltecESP32_try7/esp8266_shop_websockets . I need to make that clear.  
12:22  
This is the present ESP32 code: https://github.com/bshambaugh/BlinkyProject/tree/master/CubeCellandHeltecESP32_try7/edgeDevices/LoRaESP32/OLED_LoRa_Receiver_edit_wHelloServer
12:25  
This is the present CubeCell code: https://github.com/bshambaugh/BlinkyProject/tree/master/CubeCellandHeltecESP32_try7/edgeDevices/Cubecell/BH1750test_edit2 (I think)  
12:25  
This works with Push. CubeCell to ESP32 to Node.js. Node.js sends to database and broadcasts the data out to a cell phone (or anyone listening on websockets) (edited)   
12:26  
Future...  
12:27  
Bidirectional communication with the CubeCell (RX and TX): https://github.com/bshambaugh/BlinkyProject/tree/master/CubeCellandHeltecESP32_try7/edgeDevices/CubeCell_ToDo . Merge these plus anything with the present CubeCell code + remote signer implementation (mentioned later)  
12:29  
Quaddirectional communication with the ESP32. (RX and TX to the cubecell) (RX and TX to the Node.js server)  
12:29  
https://github.com/bshambaugh/BlinkyProject/blob/master/CubeCellandHeltecESP32_try7/edgeDevices/ESP32_ToDo/ESP32_To_Cubecell_TX.ino  
https://github.com/bshambaugh/BlinkyProject/blob/master/CubeCellandHeltecESP32_try7/edgeDevices/ESP32_ToDo/CubeCell_To_ES32_RX.ino  
12:30  
https://github.com/bshambaugh/BlinkyProject/blob/master/CubeCellandHeltecESP32_try7/edgeDevices/ESP32_ToDo/CubeCell_LoRa_To_ESP32_RX_To_NodeJS.ino  
https://github.com/bshambaugh/BlinkyProject/blob/master/CubeCellandHeltecESP32_try7/edgeDevices/ESP32_ToDo/NodeJS_To_ESP32_ToLoRa_ToCubecell_TX.ino  
12:31  
remote signer code:  
12:31  
https://github.com/bshambaugh/BlinkyProject/blob/master/CubeCellandHeltecESP32_try[…]ta_from_NodeJS_server_and_sendback_later_movebackToCubecell.ino   :doughnut: (edited)  
12:32  
move this code to the CubeCell. For now it is incubating on the ESP32. Aside from the device (CubeCell) the communication mechanism will also change. Websockets over Wifi will become LoRa. (edited)   
12:35  
This is to add talking to ceramic functionality to the Node.js server: https://github.com/bshambaugh/BlinkyProject/tree/master/CubeCellandHeltecESP32_try7/esp8266_shop_websockets/CeramicToDo  
12:36  
This is what I am going to try to use on the Node.js side to talk to the :doughnut: code as a remote signer. https://github.com/bshambaugh/BlinkyProject/blob/master/CubeCellandHeltecESP32_try[…]8266_shop_websockets/custom/verifySignature/verifySignatureQ.js  

I predict I will follow this example code [ceramic ToDo](/CubeCellandHeltecESP32_try7/esp8266_shop_websockets/CeramicToDo/README.md)  
This will require a P-256 version of [key-did-provider-ed25519](https://github.com/ceramicnetwork/key-did-provider-ed25519) .

I tried to explain my thoughts to Joel with Ceramic in May: https://twitter.com/Brent_Shambaugh/status/1467197731101941761?s=20  
He seemed to calm my worries about the data packets verifying updates being too large for LoRa to handle, since he claimed that they would be CIDs (streamIDs in ceramic in think).
StreamID description in [CIP-59](https://github.com/ceramicnetwork/CIP/blob/main/CIPs/CIP-59/CIP-59.md).

For now, this Playlist gives earlier evolution of the Blinky Project. Much, if not all, of the The Ceramic Network work is not included.  
[Blinky Project on YouTube](https://www.youtube.com/playlist?list=PLbVZNfQhcZ3eQpiBUY_0IaXPmPE5pZoOT))  

Here is an earlier sketch of the architecture.  
![alt text](readme_images/overview.png "Title")  

Here is the Cubecell pushing data to the ESP32 in the earlier architecture:
![CubeCell](readme_images/CubeCell_w_CryptoChip.png)

Here is the ESP32 receiving data from the ESP32 and pushing it to the NodeJS server:
![ESP32](readme_images/ESP32_LoRa_Gateway.jpeg)

Here is the NodeJS server receiving data from the ESP32:
![NodeJS_One](readme_images/NodeJS_Server_Accepting_Data.jpeg)

Here is the NodeJS server receiving data from the ESP32 and writing to a database and rebroadcasting on websockets:
![NodeJS_Two](readme_images/NodeJS_Server_Accepting_Data_writingToDatabase1.png)
![NodeJS_Three](readme_images/NodeJS_Server_Accepting_Data_writingToDatabase2.png)

## More stuff to consider once Ceramic Network is linked in:
https://github.com/decentralized-identity/did-jwt-vc (for verifiable credentials)
https://www.w3.org/TR/vc-data-model/ (for verifiable credentials). The goal would be to only have the LoRa device see streamIDs, and let ceramic take care of long JSON documents needed for credentials. 
Geovane Fedrecheski eloquently went into the difficulties of LoRa handling at [IIW32A - session 12E](https://raw.githubusercontent.com/windley/IIW_homepage/gh-pages/assets/proceedings/IIW_32_Book_of_Proceedings_Final%20A%201.pdf).

https://github.com/ceramicnetwork/nft-did-resolver (for NFTs) [It seems you would use key:did with 3ID, and 3ID with NFT]

https://medium.com/ceramic/idx-and-skydb-joins-forces-for-a-future-of-web3-hackathon-83eff179a9a1 , https://www.youtube.com/watch?v=-Y36JvYXwrw (skydb, possible storage option)
