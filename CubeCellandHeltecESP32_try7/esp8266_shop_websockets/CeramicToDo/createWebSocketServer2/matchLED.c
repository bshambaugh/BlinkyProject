#include <stdio.h>
#include <string.h>

void ledINFO(char * payload);
char payloadTwo[] = "getLEDstate";
char payload[] = "";
#define BUFFER_SIZE 11

int main()
{
  memset(&payload[0],0,sizeof(payload));
  strncpy(payload,payloadTwo,BUFFER_SIZE);
//  char payload[] = "getLEDstate";  // memcopy 
//  printf("%s",payload);
  ledINFO(payloadTwo);
}

void ledINFO(char * payload) {
     if(strcmp((char*)payload,"toggleLED") == 0){
       printf("Toggle the LED");
      } else if (strcmp((char*)payload,"getLEDstate") == 0) {
       printf("Get the LED State");
      } else {
       printf("message not recognized");
      }
}

