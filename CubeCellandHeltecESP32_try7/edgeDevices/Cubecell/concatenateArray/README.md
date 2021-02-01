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

Sketch > Include Library > concatenateArray

declare:
uint8_t message[32] = {
0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F,
0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1A, 0x1B, 0x1C, 0x1D, 0x1E, 0x1F
};

declare:
char messageString[65] = {'\0'};

declare:
mergeArray(32,message,messageString);

where messageString has a length of 2n+1 where n is the length of message. message, messageString are named up variable names. 
