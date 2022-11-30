#include "parsePacket.h"

void parse_packet(const string *source, string *type, string *curve, string *payload) {
  *type = (*source).substr(0,1);
 // *curve = (*source).substring(1,4);
  *curve = (*source).substr(1,5);
  //*payload = (*source).substring(5,(*source).length()-1);
  *payload = (*source).substr(5,(*source).length());
}