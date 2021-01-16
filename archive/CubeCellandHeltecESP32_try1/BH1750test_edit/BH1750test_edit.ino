/*Heltec Automation BH1750 Sensors test example
 *
 * Example of BH1750 library usage.
 *
 * This example initialises the BH1750 object using the default high resolution
 *  continuous mode and then makes a light level reading every second.
 * 
 *  Function:
 *  Lighting intensity test
 *
 * Connection:
 *
 *   VCC -> 3V3 or 5V
 *   GND -> GND
 *   SCL -> SCL
 *   SDA -> SDA
 *   ADD -> (not connected) or GND
 * Description:
 * ADD pin is used to set sensor I2C address. If it has voltage greater or equal to
 * 0.7VCC voltage (e.g. you've connected it to VCC) the sensor address will be
 * 0x5C. In other case (if ADD voltage less than 0.7 * VCC) the sensor address will
 * be 0x23 (by default).
 * 
 * HelTec AutoMation, Chengdu, China
 * www.heltec.org
 *
 * this project also realess in GitHub:
 * https://github.com/HelTecAutomation/ASR650x-Arduino
*/


#include <Wire.h>
#include <BH1750.h>
#include "LoRaWan_APP.h"
#include "Arduino.h"

/*
 * set LoraWan_RGB to 1,the RGB active in loraWan
 * RGB red means sending;
 * RGB green means received done;
 */
#ifndef LoraWan_RGB
#define LoraWan_RGB 0
#endif

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
#define BUFFER_SIZE                                 30 // Define the payload size here

char txpacket[BUFFER_SIZE];
char rxpacket[BUFFER_SIZE];

static RadioEvents_t RadioEvents;

int16_t txNumber;

int16_t rssi,rxSize;

BH1750 lightMeter;


void setup(){
  //added code
  boardInitMcu( );

  Serial.begin(115200);
  // add some code for a second serial connections, which does not appear to compile like the Mega // https://www.arduino.cc/reference/en/language/functions/communication/serial/begin/
  // Serial.begin(115200);

  //Vext ON
  pinMode(Vext,OUTPUT);
  digitalWrite(Vext,LOW);

  lightMeter.begin();

  Serial.println(F("BH1750 Test begin"));

// added more code
  
    txNumber=0;
    rssi=0;

    Radio.Init( &RadioEvents );
    Radio.SetChannel( RF_FREQUENCY );
    Radio.SetTxConfig( MODEM_LORA, TX_OUTPUT_POWER, 0, LORA_BANDWIDTH,
                                   LORA_SPREADING_FACTOR, LORA_CODINGRATE,
                                   LORA_PREAMBLE_LENGTH, LORA_FIX_LENGTH_PAYLOAD_ON,
                                   true, 0, 0, LORA_IQ_INVERSION_ON, 3000 ); 

// end of added code

}


void loop() {

  float lux = lightMeter.readLightLevel();
  Serial.print("Light: ");
  Serial.print(lux);
  Serial.println(" lx");
  delay(1000);
  // add some code
  txNumber++;
  sprintf(txpacket,"%s","Hello world number");  //start a package
  sprintf(txpacket+strlen(txpacket),"%d",txNumber); //add to the end of package
  sprintf(txpacket+strlen(txpacket),"%f",lux); // add another thing (by bret)
       
  turnOnRGB(COLOR_SEND,0); //change rgb color

  Radio.Send( (uint8_t *)txpacket, strlen(txpacket) ); //send the package out  
  // end of added code
  

}
