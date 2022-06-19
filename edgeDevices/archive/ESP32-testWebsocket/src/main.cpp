#include <Arduino.h>
#include <WiFi.h>
#include <WebSocketClient.h>
#include <Wire.h>
#include <protected.h>

#define BUFFER_SIZE                                 30 // Define the payload size here

char txpacket[BUFFER_SIZE];

boolean handshakeFailed=0;
String data= "";

// const char* ssid     = "your ssid"; // defined in protected.h
// const char* password = "your password";  // defined in protected.h
char path[] = "/";   //identifier of this device
char host[] = "10.0.0.4"; //replace this ip address with the ip address of your Node.Js server /// hostname -I (in linux)   /// networking is hard on coffeeshop wifi (192.168.45.1)
const int espport= 3000;

WebSocketClient webSocketClient;
unsigned long previousMillis = 0;
unsigned long currentMillis;
unsigned long interval=300; //interval for sending data to the websocket server in ms

// Use WiFiClient class to create TCP connections
WiFiClient client;

bool start = true;

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

void setup() {
  Wire.begin();
  Serial.begin(115200);

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
 
    // the getSignature and getPublicKey will process all of the requests from the Node.js server.
    /*
    webSocketClient.getData(data); 
    Serial.println(data);  // this does something, but I am not sure that the data is formatted correctly
    */
    
    webSocketClient.sendData(String(random(0,10)));

    /// only run the code below if 0,1,2 is the first byte...length of string should be at least two
   // Serial.println("I am a connected client"); 


   }
}