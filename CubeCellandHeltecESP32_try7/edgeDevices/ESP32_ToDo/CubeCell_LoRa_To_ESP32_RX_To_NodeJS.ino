/* Heltec Automation send communication test example
 *
 * Function:
 * 1. Send data from a CubeCell device over hardware 
 * 
 * 
 * this project also realess in GitHub:
 * https://github.com/HelTecAutomation/ASR650x-Arduino
 * */

#include <ESP32_LoRaWAN.h>
#include "Arduino.h"
#include <WiFi.h>
#include <WebSocketClient.h>
// #include "heltec.h"
#include "images.h"

#define RF_FREQUENCY                                915000000 // Hz

#define TX_OUTPUT_POWER                             14        // dBm

#define LORA_BANDWIDTH                              0         // [0: 125 kHz,
                                                              //  1: 250 kHz,
                                                              //  2: 500 kHz,
                                                              //  3: Reserved]
#define LORA_SPREADING_FACTOR                       7         // [SF7..SF12]
#define LORA_CODINGRATE                             1         // [1: 4/5,
                                                              //  2: 4/6,
                                                              //  3: 4/7,
                                                              //  4: 4/8]
#define LORA_PREAMBLE_LENGTH                        8         // Same for Tx and Rx
#define LORA_SYMBOL_TIMEOUT                         0         // Symbols
#define LORA_FIX_LENGTH_PAYLOAD_ON                  false
#define LORA_IQ_INVERSION_ON                        false


#define RX_TIMEOUT_VALUE                            1000
#define BUFFER_SIZE                                 200 // Define the payload size here

char txpacket[BUFFER_SIZE];
char rxpacket[BUFFER_SIZE];
char dummypacket[BUFFER_SIZE];

static RadioEvents_t RadioEvents;
void OnRxDone( uint8_t *payload, uint16_t size, int16_t rssi, int8_t snr );

int16_t txNumber;

int16_t Rssi,rxSize;

uint32_t  license[4] = {0xE43F317B, 0x48CAC77E, 0xC8891C04, 0xB77AFA9C};

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

void LoraAndOLEDdisplaySetup() {
   Display.init();
   delay(1500);
   Display.clear();
   Display.drawString(0, 0, "Heltec.LoRa Initial success!");
   Display.drawString(0,10, "Wait for incoming data...");
   Display.display();
   delay(1000);
}


// Heltec Logo

void logo() {
    Display.clear();
    Display.drawXbm(0,5,logo_width,logo_height,(const unsigned char *)logo_bits);
    Display.display();
}

void setup() {
    
    Serial.begin(115200);
    while (!Serial);
    SPI.begin(SCK,MISO,MOSI,SS);
    Mcu.init(SS,RST_LoRa,DIO0,DIO1,license);

    txNumber=0;
    Rssi=0;

    RadioEvents.RxDone = OnRxDone;

    Radio.Init( &RadioEvents );
    Radio.SetChannel( RF_FREQUENCY );
    Radio.SetRxConfig( MODEM_LORA, LORA_BANDWIDTH, LORA_SPREADING_FACTOR,
                                   LORA_CODINGRATE, 0, LORA_PREAMBLE_LENGTH,
                                   LORA_SYMBOL_TIMEOUT, LORA_FIX_LENGTH_PAYLOAD_ON,
                                   0, true, 0, 0, LORA_IQ_INVERSION_ON, true );

  // recieve LoRa Data and Setup Display
   LoraAndOLEDdisplaySetup();
  
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

   Radio.Rx( 0 );
   delay(500);
   Radio.IrqProcess( );
   printf("\r\n dummy packet \"%s\" \r\n",dummypacket);
   printf("\r\n the rx packet \"%s\" \r\n",rxpacket);

  Display.clear();
  Display.drawString(0,50,"Packet" + String(txNumber,DEC) + " sent done");
  Display.drawString(0,0,"Received Size" + String(rxSize,DEC) + " packages:");
  Display.drawString(0,15,rxpacket);
  Display.drawString(0,30,"With rssi " + String(Rssi,DEC));
  Display.display();


  if (client.connected()) {
    webSocketClient.getData(data);    
    if (data.length() > 0) {
      Serial.println(data);
    }
    webSocketClient.sendData(rxpacket);
  }
/*
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
//  webSocketClient.sendData(packet); 
}

  }
  else{
}
delay(5);

  }
*/
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

void OnRxDone( uint8_t *payload, uint16_t size, int16_t rssi, int8_t snr )
{
    Rssi=rssi;
    rxSize=size;
    memcpy(rxpacket, payload, size );
    rxpacket[size]='\0';
    Radio.Sleep( );

    Serial.printf("\r\nreceived packet \"%s\" with Rssi %d , length %d\r\n",rxpacket,Rssi,rxSize);
    Serial.println("wait to send next packet");
    // clear the dummy packet array here...
    memset(&dummypacket[0], 0, sizeof(dummypacket));
    strncpy(dummypacket,rxpacket,BUFFER_SIZE);
}
