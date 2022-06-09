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

void parse_packet(const string *source, string *type, string *curve, string *payload) {
  *type = (*source).substr(0,1);
  *curve = (*source).substr(1,4);
  *payload = (*source).substr(5,(*source).length()-1);
}