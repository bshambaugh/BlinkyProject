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

static RadioEvents_t RadioEvents;
void OnTxDone( void );
void OnTxTimeout( void );

int16_t txNumber;

int16_t rssi,rxSize;

uint32_t  license[4] = {0xE43F317B, 0x48CAC77E, 0xC8891C04, 0xB77AFA9C};

void setup() {
    Serial.begin(115200);
    while (!Serial);
    SPI.begin(SCK,MISO,MOSI,SS);
    Mcu.init(SS,RST_LoRa,DIO0,DIO1,license);

    txNumber=0;
    rssi=0;

    RadioEvents.TxDone = OnTxDone;
    RadioEvents.TxTimeout = OnTxTimeout;

    Radio.Init( &RadioEvents );
    Radio.SetChannel( RF_FREQUENCY );
    Radio.SetTxConfig( MODEM_LORA, TX_OUTPUT_POWER, 0, LORA_BANDWIDTH,
                                   LORA_SPREADING_FACTOR, LORA_CODINGRATE,
                                   LORA_PREAMBLE_LENGTH, LORA_FIX_LENGTH_PAYLOAD_ON,
                                   true, 0, 0, LORA_IQ_INVERSION_ON, 3000 ); 
   }



void loop()
{
  delay(1000);
  txNumber++;
  sprintf(txpacket,"%s","hello");
  sprintf(txpacket+strlen(txpacket),"%d",txNumber);
  sprintf(txpacket+strlen(txpacket),"%s"," Rssi : ");
  sprintf(txpacket+strlen(txpacket),"%d",rssi);

  Serial.printf("\r\nsending packet \"%s\" , length %d\r\n",txpacket, strlen(txpacket));

  Radio.Send( (uint8_t *)txpacket, strlen(txpacket) ); //send the package out 
}

void OnTxDone( void )
{
  Serial.print("TX done......");
}

void OnTxTimeout( void )
{
    Radio.Sleep( );
    Serial.print("TX Timeout......");
}
