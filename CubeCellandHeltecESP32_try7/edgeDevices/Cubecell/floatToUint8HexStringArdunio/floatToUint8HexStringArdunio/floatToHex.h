#include <stdint.h>
#include <string.h>
#include <stdlib.h>
#include <stdio.h>

typedef union {

    float f;
    struct
    {
        unsigned char a[4];
    } raw;
} myfloat;


void floatToByte(float number, uint8_t message[]);
