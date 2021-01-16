## To make everything:
sh build.sh

## To see how the code works on a GNU/Linux Laptop:

cd src
gcc -g floatToHex.c main.c -o main

## To remove all test files
make clean

## To load the file in the Arduino IDE
Sketch > Include Library > Add .ZIP Library

## Include library In Ardunio Sketch

Sketch > Include Library > floatToUint8HexStringArdunio
declare: uint8_t message[32];
declare: float number = -2.25; or float number = x.xx;
floatToByte(number, message);
