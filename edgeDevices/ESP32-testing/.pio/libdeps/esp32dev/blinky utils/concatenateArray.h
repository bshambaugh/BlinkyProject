#include <stdio.h>
#include <math.h>
#include <stdint.h>
#include <string.h>
#include <stdlib.h>

#include <ctype.h>

void voidUint8Array(int len, uint8_t a[]);

void voidCharArray(int len, char a[]);

void mergeCharArray(int len, unsigned char *message, char *a);

void voidUint8Array(int len, uint8_t a[]) {
   int i;
   for(i=0; i < len; i++) {
      a[i] = '\0';
   }
}

void voidCharArray(int len, char a[]) {
   int i;
   for(i=0; i < len; i++) {
      a[i] = '\0';
   }
}

void mergeCharArray(int len, unsigned char *message, char *a) {
    int i;
    char stt[5] = {0};
    for(i=0; i < len; i++) {
       sprintf(stt,"%02x",message[i]);
       strcat(a,stt); 
    }
}
