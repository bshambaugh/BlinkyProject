#include <stdio.h>
#include <string.h>

struct data {
   char chunk[275];
};

struct packet {
  char type[1];
  char crv[4];
  char payload[270];
};

void parsepack(struct data **element, struct packet *pack);
const char* RPC(struct data *element);

int main( void )
{
   struct data element;
	// the data for element is going to come in over the network
   strcpy(element.chunk,"112004569");
   const char* name = RPC(&element);
   printf("the name is: %s\n",name);
}

const char* RPC(struct data *element) {
   const char *returnString;
   returnString = "";
   struct packet pack = {"","",""};
   parsepack(&element,&pack);
   printf("the type is: %s\n",pack.type);
   printf("thw crv is: %s\n",pack.crv);
   printf("the payload is: %s\n",pack.payload);
   if(strncmp("0",pack.type,1) == 0) {
      printf("we have a public key");
      // use the sparkfunATECCx08A library to get this string
      returnString = "f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb61cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24f";
   }
   if(strncmp("1",pack.type,1) == 0) {
      printf("we have a signature");
      printf("I need to sign the payload %s\n",pack.payload);
      // use the sparkfunATECCx08A library to get this string
      returnString = "e3783a8fb69dd2f61e6ac158f41b83e223c1bf852150b75430c47fe123832ff7e472f1531c9c831dbf2b38ea5d4f3a";
   }
   if(strncmp("1200",pack.crv,4) == 0) {
      printf("we have a P-256 key");
   }
   return returnString;
}

void parsepack(struct data **element, struct packet *pack) {
    int n = 1, m = 5;
    int length, i;
    length = strlen((**element).chunk);
    for(i=0;i<n;i++) {
      strncat((*pack).type,&(**element).chunk[i],1);
    }
    for(i=n;i<m;i++) {
      strncat((*pack).crv,&(**element).chunk[i],1);
    }
    for(i=m;i<length;i++) {
      strncat((*pack).payload,&(**element).chunk[i],1);
    }
}
