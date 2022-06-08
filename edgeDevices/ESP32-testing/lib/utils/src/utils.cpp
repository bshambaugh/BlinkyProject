#include "utils.h"

bool char_sequence_compare(char a[],char b[]){
    if(strlen(a) > strlen(b)) {
      for(int i=0;a[i]!='\0';i++){
         if(a[i]!=b[i])
             return false;
      }
    } else {
       for(int i=0;b[i]!='\0';i++){
         if(a[i]!=b[i])
             return false;
       }
    }
    return true;
}

void parse_packet(char *source, char *type, char *curve, char *payload)
{
    int length, i;
    int n=0, m =4;

    char temp[5];

    printf("the source is %s\n",source);

    length = strlen(source);

   for(i=0; i <= n; i++) {
     memset(temp,'\0',sizeof(temp));
     strncpy(temp,&source[i],1);
     strcat(type,temp);
   }

   if(strncmp("0",type,1) == 0) {
     for(i=n+1;i<=m;i++) {
         memset(temp,'\0',sizeof(temp));
         strncpy(temp,&source[i],1);
         strcat(curve,temp);
     }
   } else {
     m = 0;
   }

   if(length > m) {
     for(i=m+1;i<=length;i++) {
        memset(temp,'\0',sizeof(temp));
        strncpy(temp,&source[i],1);
        strcat(payload,temp);
     }
   }


}