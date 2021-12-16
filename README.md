## Possible Use Cases
There are two guys: Joe and Sam. Joe has a few ESP32 devices with various sensors and widgets attached. So does Sam. Sam is getting to know Joe, and would like to provide him access to some sensors. He also wants to store his sensor data in a distributed way because he doesn't trust the big cloud providers. He also like the immutable web of trust, but does not want to settle on a particular blockchain. Sam creates a ceramic document that gives Joe access to the data come from  some his sensors and widgets, and even to an even fewer number he gives Joe to ability to turn on and off the sensor or the widget.

In another use case a teacher is teaching a training class and wants to give pupils access to lockers and equipment (golf carts, power tools)  and rooms to stay they night , but does not want the hassle dealing with physical keys. The teacher just wants things to work once the pupil satisfactorily completes the training. For this did-jwt-vc is considered.

In another use case someone thinks it would be great to have augmented reality where the holder of an NFT is able to unlock gates, grab an electronically enabled unicorn plush toy from the stuffed animal vendor, or who knows...

##Rough draft
This is the present Node.js server code; https://github.com/bshambaugh/BlinkyProject/tree/master/CubeCellandHeltecESP32_try7/esp8266_shop_websockets . I need to make that clear.
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

I tried to explain my thoughts to Joel with Ceramic in May: https://twitter.com/Brent_Shambaugh/status/1467197731101941761?s=20

For now, this Playlist gives earlier evolution of the Blinky Project. Much, if not all, of the The Ceramic Network work is not included.
[Blinky Project on YouTube](https://www.youtube.com/playlist?list=PLbVZNfQhcZ3eQpiBUY_0IaXPmPE5pZoOT))

Here is an earlier sketch of the architecture.
![alt text](readme_images/overview.png "Title")
