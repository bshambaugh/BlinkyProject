/*******************Esp8266_Websocket.ino****************************************/

#include <WiFi.h>
#include <WebSocketClient.h>
#include "heltec.h"
#include "images.h"

boolean handshakeFailed=0;
String data= "";

char path[] = "/";   //identifier of this device

const char* ssid     = "NETGEAR09";
const char* password = "silentsky936";
char* host = "10.0.0.5";  //replace this ip address with the ip address of your Node.Js server
const int espport= 3000;
  
WebSocketClient webSocketClient;
unsigned long previousMillis = 0;
unsigned long currentMillis;
unsigned long interval=300; //interval for sending data to the websocket server in ms

// Use WiFiClient class to create TCP connections
WiFiClient client;

// Lora stuff

#define BAND    915E6  //you can set band here directly,e.g. 868E6,915E6
String rssi = "RSSI --";
String packSize = "--";
String packet ;

void LoRaData(){
  Heltec.display->clear();
  Heltec.display->setTextAlignment(TEXT_ALIGN_LEFT);
  Heltec.display->setFont(ArialMT_Plain_10);
  Heltec.display->drawString(0 , 15 , "Received "+ packSize + " bytes");
  Heltec.display->drawStringMaxWidth(0 , 26 , 128, packet);
  Heltec.display->drawString(0, 0, rssi);  
  Heltec.display->display();
}

void cbk(int packetSize) {
  packet ="";
  packSize = String(packetSize,DEC);
  for (int i = 0; i < packetSize; i++) { packet += (char) LoRa.read(); }
  rssi = "RSSI " + String(LoRa.packetRssi(), DEC) ;
  LoRaData();
}

void LoraAndOLEDdisplaySetup() {
   //WIFI Kit series V1 not support Vext control
  Heltec.begin(true /*DisplayEnable Enable*/, true /*Heltec.Heltec.Heltec.LoRa Disable*/, true /*Serial Enable*/, true /*PABOOST Enable*/, BAND /*long BAND*/);
// not sure if I put it here
  LoRa.setSpreadingFactor(7);
  LoRa.setSignalBandwidth(125E3);
  LoRa.setCodingRate4(5);
  LoRa.setPreambleLength(8);
  LoRa.disableCrc();
  LoRa.setSyncWord(0x12);
 // end of config from forum (https://github.com/HelTecAutomation/ASR650x-Arduino/issues/28)
  Heltec.display->init();
  Heltec.display->flipScreenVertically();  
  Heltec.display->setFont(ArialMT_Plain_10);
  logo();
  delay(1500);
  Heltec.display->clear();
  
  Heltec.display->drawString(0, 0, "Heltec.LoRa Initial success!");
  Heltec.display->drawString(0, 10, "Wait for incoming data...");
  Heltec.display->display();
  delay(1000);
  //LoRa.onReceive(cbk);
  LoRa.receive();
}

// Heltec Logo

void logo(){
  Heltec.display->clear();
  Heltec.display->drawXbm(0,5,logo_width,logo_height,logo_bits);
  Heltec.display->display();
}

void setup() {
  Serial.begin(115200);
  // recieve LoRa Data and Setup Display
  LoraAndOLEDdisplaySetup();
  
 //   pinMode(readPin, INPUT);     // Initialize the LED_BUILTIN pin as an output

  delay(10);

  // We start by connecting to a WiFi network

  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");  
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  delay(1000);
  
wsconnect();
//  wifi_set_sleep_type(LIGHT_SLEEP_T);
}

void loop() {

  // LoRa stuff
  int packetSize = LoRa.parsePacket();
  if (packetSize) { cbk(packetSize);  }
  // end of the LoRa Stuff

  if (client.connected()) {
currentMillis=millis(); 
    webSocketClient.getData(data);    
    if (data.length() > 0) {
Serial.println(data);




    //*************send log data to server in certain interval************************************
 //currentMillis=millis();   
 if (abs(currentMillis - previousMillis) >= interval) {
previousMillis = currentMillis;
data= random(0,1001);
//For this project we are pretending that these random values are sensor values
//webSocketClient.sendData(data);//send sensor data to websocket server
// try to send the sensor data instead
  webSocketClient.sendData(packet); 
}

  }
  else{
}
delay(5);

  }
}
//*********************************************************************************************************************
//***************function definitions**********************************************************************************
void wsconnect(){
  // Connect to the websocket server
  if (client.connect(host, espport)) {
    Serial.println("Connected");
  } else {
    Serial.println("Connection failed.");
      delay(1000);  
   
   if(handshakeFailed){
    handshakeFailed=0;
    ESP.restart();
    }
    handshakeFailed=1;
  }

  // Handshake with the server
  webSocketClient.path = path;
  webSocketClient.host = host;
  if (webSocketClient.handshake(client)) {
    Serial.println("Handshake successful");
  } else {
    
    Serial.println("Handshake failed.");
   delay(4000);  
   
   if(handshakeFailed){
    handshakeFailed=0;
    ESP.restart();
    }
    handshakeFailed=1;
  }
}
