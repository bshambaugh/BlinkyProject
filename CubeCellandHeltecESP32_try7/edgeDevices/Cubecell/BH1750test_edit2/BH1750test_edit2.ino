#include <concatenateArray.h>

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
//#include <BH1750.h>
#include "LoRaWan_APP.h"
#include "Arduino.h"
#include <floatToHex.h>
#include <SparkFun_ATECCX08a_Arduino_Library-aug26.h>

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

//BH1750 lightMeter;

ATECCX08A atecc;
uint8_t message[32];
char publicKeyString[129];
char signatureString[129];
char messageString[65];


void setup(){
  //added code
  boardInitMcu( );

  Serial.begin(115200);
  // add some code for a second serial connections, which does not appear to compile like the Mega // https://www.arduino.cc/reference/en/language/functions/communication/serial/begin/
  // Serial.begin(115200);

  //Vext ON
  pinMode(Vext,OUTPUT);
  digitalWrite(Vext,LOW);

//  lightMeter.begin();

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

/*
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

  // check for configuration
  if (!(atecc.configLockStatus && atecc.dataOTPLockStatus && atecc.slot0LockStatus))
  {
    Serial.print("Device not configured. Please use the configuration sketch.");
    while (1); // stall out forever.
  }
*/
}


void loop() {

//  float lux = lightMeter.readLightLevel();
  float lux = 5.00;
  floatToByte(lux, message);
  printMessage(); 
  atecc.createSignature(message);
  Serial.println("-------------");
  Serial.println(atecc.signature[63]);
  Serial.println(atecc.publicKey64Bytes[63]);
  voidArray(65,messageString);
  voidArray(129,signatureString);
  voidArray(129,publicKeyString);
  mergeArray(32,message,messageString);
  mergeArray(64,atecc.signature,signatureString);
  mergeArray(64,atecc.publicKey64Bytes,publicKeyString);
  Serial.println("messageString:");
  Serial.print(messageString);
  Serial.println("signatureString:");
  Serial.print(signatureString);
  Serial.println("publicKeyString:");
  Serial.print(publicKeyString); 
  Serial.println("-------------");
  Serial.print("Light: ");
  Serial.print(lux);
  Serial.println(" lx");
  // add some code
  txNumber++;
  sprintf(txpacket+strlen(txpacket),"%d",txNumber); //add to the end of package
  sprintf(txpacket+strlen(txpacket),"%s",","); // add another thing (by bret)
  sprintf(txpacket+strlen(txpacket),"%s","signature"); // add another thing (by bret)
  sprintf(txpacket+strlen(txpacket),"%s",","); // add another thing (by bret)
  sprintf(txpacket+strlen(txpacket),"%s",signatureString); // add another thing (by bret)
  /*
  sprintf(txpacket+strlen(txpacket),"%s",","); // add another thing (by bret)
  sprintf(txpacket+strlen(txpacket),"%s",publicKeyString); // add another thing (by bret)
  */

  Serial.print("here is the transmission packet");
  Serial.println(txpacket);
       
  turnOnRGB(COLOR_SEND,0); //change rgb color

  Radio.Send( (uint8_t *)txpacket, strlen(txpacket) ); //send the package out  
  // end of added code

  voidArray(BUFFER_SIZE,txpacket);

  Serial.print("here is the transmission packet after void array:");
  Serial.println(txpacket);

  delay(333);

  sprintf(txpacket+strlen(txpacket),"%d",txNumber); //add to the end of package
  sprintf(txpacket+strlen(txpacket),"%s",","); // add another thing (by bret)
  sprintf(txpacket+strlen(txpacket),"%s","publicKey"); // add another thing (by bret)
  sprintf(txpacket+strlen(txpacket),"%s",","); // add another thing (by bret)
  sprintf(txpacket+strlen(txpacket),"%s",publicKeyString); // add another thing (by bret)

  Serial.print("here is the transmission packet");
  Serial.println(txpacket);

  turnOnRGB(COLOR_SEND,0); //change rgb color

  Radio.Send( (uint8_t *)txpacket, strlen(txpacket) ); //send the package out  
  // end of added code

  voidArray(BUFFER_SIZE,txpacket);

  delay(333);

  sprintf(txpacket+strlen(txpacket),"%d",txNumber); //add to the end of package
  sprintf(txpacket+strlen(txpacket),"%s",","); // add another thing (by bret)
  sprintf(txpacket+strlen(txpacket),"%s","message"); // add another thing (by bret)
  sprintf(txpacket+strlen(txpacket),"%s",","); // add another thing (by bret)
  sprintf(txpacket+strlen(txpacket),"%s",messageString); // add another thing (by bret)

  Serial.print("here is the transmission packet");
  Serial.println(txpacket);

  turnOnRGB(COLOR_SEND,0); //change rgb color

  Radio.Send( (uint8_t *)txpacket, strlen(txpacket) ); //send the package out  
  // end of added code

  voidArray(BUFFER_SIZE,txpacket);
  
  voidArray(65,messageString);
  voidArray(129,signatureString);
  voidArray(129,publicKeyString);

  delay(333);

}

void printMessage()
{
  Serial.println("uint8_t message[32] = {");
  for (int i = 0; i < sizeof(message) ; i++)
  {
    Serial.print("0x");
    if ((message[i] >> 4) == 0) Serial.print("0"); // print preceeding high nibble if it's zero
    Serial.print(message[i], HEX);
    if (i != 31) Serial.print(", ");
    if ((31 - i) % 16 == 0) Serial.println();
  }
  Serial.println("};");
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
      Serial.println("Failure to generate this device's Public Key");
      Serial.println();
    }
  }
}
