#include <Arduino.h>
#include <SparkFun_ATECCX08a_Arduino_Library.h>   /// the latest version of this library might work with the ESP32. so you do not need to use Blinky's *-aug26.h
#include <WiFi.h>
#include <WebSocketClient.h>
#include <Wire.h>
#include <concatenateArray.h>
#include <protected.h>

#define BUFFER_SIZE                                 30 // Define the payload size here

char txpacket[BUFFER_SIZE];

boolean handshakeFailed=0;
String data= "";

// const char* ssid     = "your ssid"; // defined in protected.h
// const char* password = "your password";  // defined in protected.h
char path[] = "/";   //identifier of this device
char host[] = "10.0.0.4"; //replace this ip address with the ip address of your Node.Js server /// hostname -I (in linux)
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
int compare(char a[],char b[]){
    if(strlen(a) > strlen(b)) {
      for(int i=0;a[i]!='\0';i++){
         if(a[i]!=b[i])
             return 0;
      }
    } else {
       for(int i=0;b[i]!='\0';i++){
         if(a[i]!=b[i])
             return 0;
       }
    }
    return 1;
}

// verify that the public key matches the key:did you think it is
// this should take the payload as an argument
bool verifyKeyDID(char *payload) {
   Serial.println("my payload is;");
   Serial.println(payload);
   voidArray(129,publicKeyString);
   mergeArray(64,atecc.publicKey64Bytes,publicKeyString);
   Serial.println("my public key string is");
   Serial.println(publicKeyString);
   if(compare(payload,publicKeyString)) {
    return true;
   } else {
    return false;
   }
   // if the payload matches the publicKeyString return true
   // else return false
   // this involves matching two char arrays (they may not be the same length, but they will have the same contents)
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
void websocketGetSignature(char *payload) {
         // get the data that you want to sign...(the RPC should be method with the argument of what you want to sign...)
         Serial.println("The data that I have");
         // rather than data, this should be payload
         Serial.println(payload);
         Serial.println("Okay, I am getting the signature");
         // I need to convert from a char string to a String object (that way I can write dataGetByes...of convert the payload into a byte string some other way)
         // data.getBytes(bufferString,64)
         (String(*payload,strlen(payload))).getBytes(bufferString,64);  /// copies data characters into bufferString as a byteString that can be signed
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

}

// the packet should only be parsed if the first character is 0, 1, or 2...the character length should be greater than or equal to two
void parse_packet(char *source, char *type, char *curve, char *payload)
{
    int length, i;
    int n=0, m =4;

    char temp[5];

    printf("the source is %s\n",source);

    length = strlen(source);

   for(i=0; i <= n; i++) {
     memset(temp,'\0',sizeof(temp));
     strncpy(temp,&source[i],1);
     strcat(type,temp);
   }

   if(strncmp("0",type,1) == 0) {
     for(i=n+1;i<=m;i++) {
         memset(temp,'\0',sizeof(temp));
         strncpy(temp,&source[i],1);
         strcat(curve,temp);
     }
   } else {
     m = 0;
   }

   if(length > m) {
     for(i=m+1;i<=length;i++) {
        memset(temp,'\0',sizeof(temp));
        strncpy(temp,&source[i],1);
        strcat(payload,temp);
     }
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

    /// only run the code below if 0,1,2 is the first byte...length of string should be at least two
    Serial.println("I am a connected client"); 

// check that packet has one the available prefixes (0,1,2,3), and the data has a type
    if(((data.charAt(0) == '0') || (data.charAt(0) == '1') || (data.charAt(0) == '2') || (data.charAt(0) == '3')) && (data.length() >= 5)) {

        parse_packet(&data[0],type,curve,payload);

        if (strncmp("0",type,1) == 0) {
           Serial.println("Match Public Key to stored\n");
           // some function that grabs the public key from the cryptochip and matches to what is sent
           if(verifyKeyDID(payload)) {
              Serial.println("You guessed my name");
           } else {
              Serial.println("You did not guess my name");
           }
        }

        if (strncmp("1",type,1) == 0) {
           Serial.println("I have a public Key\n");
           websocketSendPublicKey();
        }

        if (strncmp("2",type,1) == 0) {
          printf("I have a signature\n");
          if  (strlen(payload) > 0) {
             Serial.println("Sign the payload\n");
              websocketGetSignature(payload);  // this needs to refactored to sign the payload
          }
        }

        if (strncmp("3",type,1) == 0) {
         Serial.println("I have a message\n");
        }

        voidArray(5,type);
        voidArray(5,curve);
        voidArray(200,payload);
    } else {
        Serial.println("Invalid packet");
    }


   }
}