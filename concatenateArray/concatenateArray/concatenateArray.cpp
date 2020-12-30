#include "concatenateArray.h"

void mergeArray(int len, unsigned char *message, char *a) {
    int i;
    char stt[5];
    for(i=0; i < len; i++) {
       sprintf(stt,"%02x",message[i]);
       strcat(a,stt); 
    }
}
