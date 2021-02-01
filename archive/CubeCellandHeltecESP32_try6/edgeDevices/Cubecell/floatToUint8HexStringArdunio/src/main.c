#include "floatToHex.h"

float number = -2.25;

uint8_t message[32];

int main() {
 int i;
 floatToByte(number, message);
 for(i = 0; i < 32; i++) {
    printf("here is the -2.25 message[i] %X\n",message[i]);
 }
 number = 8.37;
 floatToByte(number, message);
  for(i = 0; i < 32; i++) {
    printf("here is the 8.37 message[i] %X\n",message[i]);
 }

 return 0;
}
