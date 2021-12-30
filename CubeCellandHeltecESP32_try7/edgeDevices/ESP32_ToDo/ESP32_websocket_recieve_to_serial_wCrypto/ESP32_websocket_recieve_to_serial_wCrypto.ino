/* Heltec Automation send communication test example
 *
 * Function:
 * 1. Send data from a CubeCell device over hardware 
 * 
 * 
 * this project also realess in GitHub:
 * https://github.com/HelTecAutomation/ASR650x-Arduino
 * */
#include <concatenateArray.h>
#include "Arduino.h"
#include <WiFi.h>
#include <WebSocketClient.h>
#include <SparkFun_ATECCX08a_Arduino_Library-aug26.h> //Click here to get the library: http://librarymanager/All#SparkFun_ATECCX08a
#include <Wire.h>

#define BUFFER_SIZE                                 30 // Define the payload size here

char txpacket[BUFFER_SIZE];

boolean handshakeFailed=0;
String data= "";

char path[] = "/";   //identifier of this device

const char* ssid     = "ssid";
const char* password = "password";
char* host = "10.0.0.5";  //replace this ip address with the ip address of your Node.Js server
const int espport= 3000;
  
WebSocketClient webSocketClient;
unsigned long previousMillis = 0;
unsigned long currentMillis;
unsigned long interval=300; //interval for sending data to the websocket server in ms

// Use WiFiClient class to create TCP connections
WiFiClient client;

// Start the CryptoChip
ATECCX08A atecc;

// set up an array for the signature
char signatureString[129];
char publicKeyString[129];
//uint8_t message[32];
uint8_t bufferString[64];
//unsigned char bufferString[64];

bool start = true;

void setup() {
    Wire.begin();
    Serial.begin(115200);

  // check the ESP
  if (atecc.begin() == true)
  {
    Serial.println("Successful wakeUp(). I2C connections are good.");
  }
  else
  {
    Serial.println("Device not found. Check wiring.");
    while (1); // stall out forever
  }

  printInfo(); // see function below for library calls and data handling

  /// print atecc object

 // Serial.println(atecc);

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
}


void loop() {

  delay(1000);

  if (client.connected()) {
    // websocket needs to sendData public key, but it needs to stop doing this until it is asked again.
    if (start == true) {
      Serial.println("I am true");
      webSocketClient.sendData("Here is my public key");
      websocketSendPublicKey();
      webSocketClient.sendData("end of sending my public key for the 1st time");
      start = false;
    }
    // the getSignature and getPublicKey will process all of the requests from the Node.js server.
    webSocketClient.getData(data); 
    Serial.println("I am a connected client");   

     if(data.length() > 0) {
      Serial.println(data);
      webSocketClient.sendData("I am replying back");
        if(data == "getSignature") {
         // get the data that you want to sign...(the RPC should be method with the argument of what you want to sign...)
         Serial.println("Okay, I am getting the signature");
         data.getBytes(bufferString,64);
          // createSignature can only sign a byte array
         atecc.createSignature(bufferString);
         Serial.println(atecc.signature[63]);
         voidArray(129,signatureString);
         mergeArray(64,atecc.signature,signatureString);

         sprintf(txpacket+strlen(txpacket),"%s","signature"); // add another thing (by bret)
         sprintf(txpacket+strlen(txpacket),"%s",","); // add another thing (by bret)
         sprintf(txpacket+strlen(txpacket),"%s",signatureString); // add another thing (by bret)
    
         Serial.println(txpacket); 

         webSocketClient.sendData(txpacket);
         
         voidArray(129,signatureString);

         voidArray(BUFFER_SIZE,txpacket);
         
        }  

         if(data == "getPublicKey") {
          // get the public key...(the RPC should be method with no argments...)
           websocketSendPublicKey();
        } 
        
        if(data == "something") {
         webSocketClient.sendData("I heard something");
        } 
      }
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

void printInfo()
{
  // Read all 128 bytes of Configuration Zone
  // These will be stored in an array within the instance named: atecc.configZone[128]
  atecc.readConfigZone(false); // Debug argument false (OFF)

  // Print useful information from configuration zone data
  Serial.println();

  Serial.print("Serial Number: \t");
  for (int i = 0 ; i < 9 ; i++)
  {
    if ((atecc.serialNumber[i] >> 4) == 0) Serial.print("0"); // print preceeding high nibble if it's zero
    Serial.print(atecc.serialNumber[i], HEX);
  }
  Serial.println();

  Serial.print("Rev Number: \t");
  for (int i = 0 ; i < 4 ; i++)
  {
    if ((atecc.revisionNumber[i] >> 4) == 0) Serial.print("0"); // print preceeding high nibble if it's zero
    Serial.print(atecc.revisionNumber[i], HEX);
  }
  Serial.println();

  Serial.print("Config Zone: \t");
  if (atecc.configLockStatus) Serial.println("Locked");
  else Serial.println("NOT Locked");

  Serial.print("Data/OTP Zone: \t");
  if (atecc.dataOTPLockStatus) Serial.println("Locked");
  else Serial.println("NOT Locked");

  Serial.print("Data Slot 0: \t");
  if (atecc.slot0LockStatus) Serial.println("Locked");
  else Serial.println("NOT Locked");

  Serial.println();

  // if everything is locked up, then configuration is complete, so let's print the public key
  if (atecc.configLockStatus && atecc.dataOTPLockStatus && atecc.slot0LockStatus) 
  {
    if(atecc.generatePublicKey() == false)
    {
      Serial.println("Failure to generate This device's Public Key");
      Serial.println();
    }
  }
}

// getthepublicKey
void websocketSendPublicKey() {
         Serial.println("Okay, I am getting the Public Key");
         Serial.println(atecc.publicKey64Bytes[63]);
         voidArray(129,publicKeyString);
         mergeArray(64,atecc.publicKey64Bytes,publicKeyString);

         sprintf(txpacket+strlen(txpacket),"%s","publicKey"); // add another thing (by bret)
         sprintf(txpacket+strlen(txpacket),"%s",","); // add another thing (by bret)
         sprintf(txpacket+strlen(txpacket),"%s",publicKeyString); // add another thing (by bret)
    
         Serial.println(txpacket); 

         webSocketClient.sendData(txpacket);
         
         voidArray(129,publicKeyString);

         voidArray(BUFFER_SIZE,txpacket);
}

// gettheSignature
