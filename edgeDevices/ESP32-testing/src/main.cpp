#include <Arduino.h>
#include <SparkFun_ATECCX08a_Arduino_Library.h>   /// the latest version of this library might work with the ESP32. so you do not need to use Blinky's *-aug26.h
#include <WiFi.h>
#include <WebSocketClient.h>
#include <Wire.h>
#include <concatenateArray.h>
#include <char_string_util.h>
#include <protected.h>
#include <websocketserver_config.h>

#define BUFFER_SIZE                                 30 // Define the payload size here

char txpacket[BUFFER_SIZE];

boolean handshakeFailed=0;
String data= "";

// const char* ssid     = "your ssid"; // defined in protected.h
// const char* password = "your password";  // defined in protected.h
//char path[] = "/";   //identifier of this device
//char host[] = "10.0.0.4"; //replace this ip address with the ip address of your Node.Js server /// hostname -I (in linux)
//char host[] = "192.168.1.155";
//const int espport= 3000;

WebSocketClient webSocketClient;

// Use WiFiClient class to create TCP connections
WiFiClient client;

// Start the CryptoChip
ATECCX08A atecc;

// set up an array for the signature
char signatureString[129];
char publicKeyString[129];
//uint8_t message[32];
uint8_t bufferString[64];
//char bufferString[64];
// unsigned char bufferString[64];

// bool start = true;

const byte MaxByteArraySize = 32;
byte byteArray[MaxByteArraySize] = {0};

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

// verify that the public key matches the key:did you think it is
// this should take the payload as an argument
bool verifyKeyDID(const String payload) {
   // somehow payload which is a string needs to be converted to a char array
   const char* payload_str = payload.c_str();
   voidCharArray(129,publicKeyString);
   mergeCharArray(64,atecc.publicKey64Bytes,publicKeyString);
   Serial.println("my public key string is");
   Serial.println(publicKeyString);
   if(char_sequence_compare(payload_str,publicKeyString)) {
    voidCharArray(129,publicKeyString);
    return true;
   } else {
    voidCharArray(129,publicKeyString);
    return false;
  }
   // if the payload matches the publicKeyString return true
   // else return false
   // this involves matching two char arrays (they may not be the same length, but they will have the same contents)
}

char getPublicKeyPacket() {
         Serial.println("Okay, I am getting the Public Key");
         Serial.println(atecc.publicKey64Bytes[63]);
         voidCharArray(129,publicKeyString);
         mergeCharArray(64,atecc.publicKey64Bytes,publicKeyString);

         sprintf(txpacket+strlen(txpacket),"%s","publicKey"); // add another thing (by bret)
         sprintf(txpacket+strlen(txpacket),"%s",","); // add another thing (by bret)
         sprintf(txpacket+strlen(txpacket),"%s",publicKeyString); // add another thing (by bret)
         voidCharArray(129,publicKeyString);
         return *txpacket;
}

void websocketSendPublicKey() {
        *txpacket = getPublicKeyPacket();
    
         Serial.println(txpacket); 

         webSocketClient.sendData(txpacket);

         voidCharArray(BUFFER_SIZE,txpacket);
}

char getSignaturePacket(String payload) {
         Serial.println("Okay, I am getting the Signature");
         Serial.println(payload);
         const char* payload_str = payload.c_str();
       
         hexCharacterStringToBytes(byteArray, payload_str);
        
          for (byte i = 0; i < 32; i++)
          {
            Serial.println(byteArray[i]);
          }
         atecc.createSignature(byteArray);
         Serial.println(atecc.signature[63]);
         voidCharArray(129,signatureString);
         mergeCharArray(64,atecc.signature,signatureString);
         sprintf(txpacket+strlen(txpacket),"%s","signature"); // add another thing (by bret)
         sprintf(txpacket+strlen(txpacket),"%s",","); // add another thing (by bret)
         sprintf(txpacket+strlen(txpacket),"%s",signatureString); // add another thing (by bret)
         voidCharArray(129,signatureString);
         voidUint8Array(MaxByteArraySize,byteArray);
         return *txpacket;
}

void websocketSendSignature(String payload) {
       *txpacket = getSignaturePacket(payload);
       Serial.println(txpacket); 

       webSocketClient.sendData(txpacket);
       voidCharArray(BUFFER_SIZE,txpacket);
}

char getMessageASCIIstring(String payload) {
      Serial.println("Okay, I am getting the ASCII Message");
      Serial.println(payload);
      const char* payload_str = payload.c_str();
      /*
      sprintf(txpacket+strlen(txpacket),"%s","message"); // add another thing (by bret)
      sprintf(txpacket+strlen(txpacket),"%s",","); // add another thing (by bret)
      */
      sprintf(txpacket+strlen(txpacket),"%s",payload_str); // add another thing (by bret)
      return *txpacket;
}

void websocketSendASCIIstring(String payload) {
    *txpacket = getMessageASCIIstring(payload);
     Serial.println(txpacket); 
     webSocketClient.sendData(txpacket);
     voidCharArray(BUFFER_SIZE,txpacket);
}

void parse_packet(const String *source, String *type, String *curve, String *payload) {
  *type = (*source).substring(0,1);
 // *curve = (*source).substring(1,4);
  *curve = (*source).substring(1,5);
  //*payload = (*source).substring(5,(*source).length()-1);
  *payload = (*source).substring(5,(*source).length());
}

void RPC(String &source) {
      String type = "";
      String curve = "";
      String payload = "";
      if(((source.charAt(0) == '0') || (source.charAt(0) == '1') || (source.charAt(0) == '2') || (source.charAt(0) == '3')) && (source.length() >= 5)) {
           parse_packet(&source,&type,&curve,&payload);

           if(compareString({"0"},type.c_str())) {
              Serial.println("Match Public Key to stored\n");
              // some function that grabs the public key from the cryptochip and matches to what is sent
              // actually verifyKeyDID should only take the hex string as an argument, AFAIK this function has not been battle tested
              Serial.println("The type is:");
              Serial.println(type);
              Serial.println("The curve is:");
              Serial.println(curve);
              Serial.println("The payload is:");
              Serial.println(payload);
              if(verifyKeyDID(payload)) {
                Serial.println("You guessed my name");
                // websocketsend 1
              //  sendStringoverWebSocket("1"); // check to see if this works
                getMessageASCIIstring("1"); // refactor the Node.js side to parse with a message header ...see function definition
                // construct a function to send back arbitary data over websockets, follow the pattern in websocketSendPublicKey and websocketGetSignature
               } else {
                Serial.println("You did not guess my name");
                // websocketsend 0
                // sendStringoverWebSocket("0"); // check to see if this works
                websocketSendPublicKey();
                // construct a function to send back arbitary data over websockets, follow the pattern in websocketSendPublicKey and websocketGetSignature
              }
            }
 
            if(compareString({"1"},type.c_str())) {
                Serial.println("Here is the public key of my cryptographic co-processor\n");
                websocketSendPublicKey();
            }

            if(compareString({"2"},type.c_str())) {
                 if(payload.length() > 0) {
                     Serial.println("Sign the payload\n");
                   //  websocketGetSignature(payload);  // this needs to refactored to sign the payload
                     websocketSendSignature(payload);
                 }
            }

            if(compareString({"3"},type.c_str())) {
                Serial.println("I have a message\n");
            }
      } else {
          Serial.println("Invalid packet");
      }

}

void setupWifi() {
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
}

void setupCryptoChip() {
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
}

void setup() {
  Wire.begin();
  Serial.begin(115200);

  setupCryptoChip();

  // We start by connecting to a WiFi network
  setupWifi();

  wsconnect();
}

void loop() {
 // delay(1000); /// this delay may need to be changed...
 delay(250);

  if (client.connected()) {
 
    // the getSignature and getPublicKey will process all of the requests from the Node.js server.
    webSocketClient.getData(data); 

    /// only run the code below if 0,1,2 is the first byte...length of string should be at least two
    Serial.println("I am a connected client"); 

   RPC(data);
   data= "";

   }
}
