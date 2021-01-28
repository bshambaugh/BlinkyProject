#include <stdlib.h>
#include <stdint.h>
#include "concatenateArray.h"
#include <unity.h>

void setUp(void)
{
}

void tearDown(void)
{
}

void test_mergeArray(void) {
    uint8_t publicKey[64] = {
    0xF9, 0xC3, 0x6F, 0x89, 0x64, 0x62, 0x33, 0x78, 0xBD, 0xC0, 0x68, 0xD4, 0xBC, 0xE0, 0x7E, 0xD1,
    0x7C, 0x8F, 0xA4, 0x86, 0xF9, 0xAC, 0x0C, 0x26, 0x13, 0xCA, 0x3C, 0x8C, 0x30, 0x6D, 0x7B, 0xB6,
    0x1C, 0xD3, 0x67, 0x17, 0xB8, 0xAC, 0x5E, 0x4F, 0xEA, 0x8A, 0xD2, 0x3D, 0xC8, 0xD0, 0x78, 0x3C,
    0x23, 0x18, 0xEE, 0x4A, 0xD7, 0xA8, 0x0D, 0xB6, 0xE0, 0x02, 0x6A, 0xD0, 0xB0, 0x72, 0xA2, 0x4F
    };

   uint8_t message[32] = {
   0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F,
   0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1A, 0x1B, 0x1C, 0x1D, 0x1E, 0x1F
   };

   char publicKeyString[129] = {'\0'};
   char messageString[65] = {'\0'};
   mergeArray(32,message,messageString);
   mergeArray(64,publicKey,publicKeyString);
   TEST_ASSERT_EQUAL_STRING("000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f", messageString);
   TEST_ASSERT_EQUAL_STRING("f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb61cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24f", publicKeyString);
}

void test_voidArray(void) {
   char expected[5] = {'\0','\0','\0','\0','\0'};
   char target[5] = {'A','B','C','D'};
   voidArray(5,target);
   TEST_ASSERT_EQUAL_CHAR_ARRAY(expected, target, 5); 
}