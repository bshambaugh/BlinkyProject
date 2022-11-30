#include <Arduino.h>
#include <Wire.h>
#include <string>
using namespace std;


String data= "hello";
// char a[6];
String binary = "010101";


string b = "";

void RPC(String &Source) {
   string source = "";
   source = Source.c_str();
   String payload = "";
   String datum = "";
   
   if(((source.substr(0,1) == "0") || (source.substr(0,1) == "1") ||  (source.substr(0,1) == "2") )  &&  (source.length() >= 5)) {
      Serial.println("I match them all!");
      Serial.println(String(source.substr(0,2).c_str()));
      payload = String(source.substr(0,2).c_str());
      Serial.println(payload);
      datum = String(source.c_str());
      Serial.println(datum);
   }
   // do not need due to automatically declared descructor ...
   /*
   delete &datum;
   delete &payload;
   */
}


void setup() {
  Wire.begin();
  Serial.begin(115200);
 // data.toCharArray(a,6);
  b = data.c_str();
  if(b == "helo") {
    Serial.println("hody");
  } else {
    Serial.println("not hody");
  }
  if(b.substr(0,1) == "h") {
    Serial.println("I have an h");
  }
  if(b.length() >= 6) {
    Serial.println("I am longer than 6");
  } else {
    Serial.println("I am not longer than 6");
  }

  if((b.substr(0,1) == "h") && (b.length() >= 5)) {
    Serial.println("My first letter is h, and I have a length of at least 5");
  } else {
    Serial.println("Failed on all accounts sir");
  }

  RPC(binary);

}

void loop() {
 // delay(1000); /// this delay may need to be changed...
 delay(250);
// Serial.println(a);
 Serial.println(data);

}
