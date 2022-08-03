#include <Arduino.h>
#include <SparkFun_ATECCX08a_Arduino_Library.h>   /// the latest version of this library might work with the ESP32. so you do not need to use Blinky's *-aug26.h
#include <WiFi.h>
#include <WebSocketClient.h>
#include <Wire.h>
#include <concatenateArray.h>
#include <protected.h>
//#include "utils.h"

#define BUFFER_SIZE                                 30 // Define the payload size here

char txpacket[BUFFER_SIZE];

boolean handshakeFailed=0;
String data= "";

// const char* ssid     = "your ssid"; // defined in protected.h
// const char* password = "your password";  // defined in protected.h
char path[] = "/";   //identifier of this device
char host[] = "10.0.0.2"; //replace this ip address with the ip address of your Node.Js server /// hostname -I (in linux)
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
//char bufferString[64];
// unsigned char bufferString[64];

bool start = true;

char type[5];
char curve[5];
char payload[200];

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

// Modified https://stackoverflow.com/questions/15050766/comparing-the-values-of-char-arrays-in-c#15050807
// compares two character arrays to see if they have the same sequence of characters
// I might need to modify this to return a pointer or something...
bool char_sequence_compare(const char a[],const char b[]){
    if(strlen(a) > strlen(b)) {
      for(int i=0;a[i]!='\0';i++){
         if(a[i]!=b[i])
             return false;
      }
    } else {
       for(int i=0;b[i]!='\0';i++){
         if(a[i]!=b[i])
             return false;
       }
    }
    return true;
}

// verify that the public key matches the key:did you think it is
// this should take the payload as an argument
bool verifyKeyDID(const String payload) {
   // somehow payload which is a string needs to be converted to a char array
   const char* payload_str = payload.c_str();
   voidArray(129,publicKeyString);
   mergeArray(64,atecc.publicKey64Bytes,publicKeyString);
   Serial.println("my public key string is");
   Serial.println(publicKeyString);
   if(char_sequence_compare(payload_str,publicKeyString)) {
    return true;
   } else {
    return false;
  }
   // if the payload matches the publicKeyString return true
   // else return false
   // this involves matching two char arrays (they may not be the same length, but they will have the same contents)
}

// what happens when the payload is larger than the BUFFER_SIZE ??
void sendStringoverWebSocket(char *payload) {
   sprintf(txpacket+strlen(txpacket),"%s",payload);
   webSocketClient.sendData(txpacket);
   voidArray(BUFFER_SIZE,txpacket);
}

// refactor this with sendStringoverWebSocket
// getthepublicKey
void websocketSendPublicKey() {
         Serial.println("Okay, I am getting the Public Key");
         Serial.println(atecc.publicKey64Bytes[63]);
         voidArray(129,publicKeyString);
         mergeArray(64,atecc.publicKey64Bytes,publicKeyString);

         sprintf(txpacket+strlen(txpacket),"%s","publicKey"); // add another thing (by bret)
         sprintf(txpacket+strlen(txpacket),"%s",","); // add another thing (by bret)
         sprintf(txpacket+strlen(txpacket),"%s",publicKeyString); // add another thing (by bret)
        // sprintf(txpacket+strlen(txpacket),"%s","\n"); // add another thing (by bret)
    
         Serial.println(txpacket); 

         webSocketClient.sendData(txpacket);
         
         voidArray(129,publicKeyString);

         voidArray(BUFFER_SIZE,txpacket);
}

// refactor this with sendStringoverWebSocket
// gettheSignature
void websocketGetSignature(String payload) {
         Serial.println("Okay, I am getting the Signature");
         const char* payload_str = payload.c_str();
         (String(*payload_str,strlen(payload_str))).getBytes(bufferString,64);  /// copies data characters into bufferString as a byteString that can be signed
         atecc.createSignature(bufferString);
         Serial.println(atecc.signature[63]);
         voidArray(129,signatureString);
         mergeArray(64,atecc.signature,signatureString);

         sprintf(txpacket+strlen(txpacket),"%s","signature"); // add another thing (by bret)
         sprintf(txpacket+strlen(txpacket),"%s",","); // add another thing (by bret)
         sprintf(txpacket+strlen(txpacket),"%s",signatureString); // add another thing (by bret)
       //  sprintf(txpacket+strlen(txpacket),"%s","\n"); // add another thing (by bret)
    
         Serial.println(txpacket); 

         webSocketClient.sendData(txpacket);
         
         voidArray(129,signatureString);

         voidArray(BUFFER_SIZE,txpacket);

         voidUint8Array(64,bufferString);
}

bool compareString(String s1, String s2)
{  
      if(s1.compareTo(s2) == 0) {
           return true;
      } else {
           return false;
      }
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
      if(((source.charAt(0) == '0') | (source.charAt(0) == '1') | (source.charAt(0) == '2') | (source.charAt(0) == '3')) && (source.length() >= 5)) {
           parse_packet(&source,&type,&curve,&payload);

           if(compareString("0",type)) {
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
                sendStringoverWebSocket("1"); // check to see if this works
                // construct a function to send back arbitary data over websockets, follow the pattern in websocketSendPublicKey and websocketGetSignature
               } else {
                Serial.println("You did not guess my name");
                // websocketsend 0
                // sendStringoverWebSocket("0"); // check to see if this works
                websocketSendPublicKey();
                // construct a function to send back arbitary data over websockets, follow the pattern in websocketSendPublicKey and websocketGetSignature
              }
            }

            if(compareString("1",type)) {
                Serial.println("Here is the public key of my cryptographic co-processor\n");
                websocketSendPublicKey();
            }

            if(compareString("2",type)) {
                 if(payload.length() > 0) {
                     Serial.println("Sign the payload\n");
                     websocketGetSignature(payload);  // this needs to refactored to sign the payload
                 }
            }

            if(compareString("3",type)) {
                Serial.println("I have a message\n");
            }
      } else {
          Serial.println("Invalid packet");
      }
}

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
 
    // the getSignature and getPublicKey will process all of the requests from the Node.js server.
    webSocketClient.getData(data); 

    /// only run the code below if 0,1,2 is the first byte...length of string should be at least two
    Serial.println("I am a connected client"); 

   RPC(data);

   }
}