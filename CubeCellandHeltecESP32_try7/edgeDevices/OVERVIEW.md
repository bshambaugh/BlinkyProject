Here is a sketch showing the overview of code that should fit together for biderectional communication with a gateway:
![Edge Device Overview](DSC_0103s.JPG)

Bidirectional Communication has been achieved by combining files for the CubeCell and the Heltec LoRa ESP32:

Here is the combined code for the CubeCell:
[CubeCell Bidirectional Code](https://github.com/bshambaugh/BlinkyProject/blob/aug13osh/CubeCellandHeltecESP32_try7/edgeDevices/CubeCell_ToDo/cubecell_morse/src/main.cpp)

Here is the combined code for the LoRa ESP32:
[LoRa ESP32 Bidirectional Code](https://github.com/bshambaugh/BlinkyProject/blob/aug13osh/CubeCellandHeltecESP32_try7/edgeDevices/ESP32_ToDo/Heltec_LoRa_ESP32_morse/src/main.cpp)
