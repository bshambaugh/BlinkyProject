#include "CubeCell_NeoPixel.h"
CubeCell_NeoPixel pixels(1, RGB, NEO_GRB + NEO_KHZ800);

void setup() {
  // put your setup code here, to run once:
  pinMode(Vext,OUTPUT);
  digitalWrite(Vext,LOW); //SET POWER
  pixels.begin(); // INITIALIZE NeoPixel strip object (REQUIRED)
  pixels.clear(); // Set all pixel colors to 'off'
}

void loop() {
  // put your main code here, to run repeatedly:

    pixels.setPixelColor(0, pixels.Color(0, 0, 125));

    pixels.show();   // Send the updated pixel colors to the hardware.

    delay(200); // Pause before next pass through loop

    // pixels.clear();  /// if I included this, I would get an led that never turned off

    // this code does the same thing as pixels.clear();

    pixels.setPixelColor(0, pixels.Color(0, 0, 0));

    pixels.show();   // Send the updated pixel colors to the hardware.

    delay(200);

}
