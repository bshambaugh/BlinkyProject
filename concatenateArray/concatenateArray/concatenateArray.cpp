#include "concatenateArray.h"

void voidArray(int len, char a[]) {
   int i;
   for(i=0; i < len; i++) {
      a[i] = '\0';
   }
}

void mergeArray(int len, unsigned char *message, char *a) {
    int i;
    char stt[5];
    for(i=0; i < len; i++) {
       sprintf(stt,"%02x",message[i]);
       strcat(a,stt); 
    }
}
