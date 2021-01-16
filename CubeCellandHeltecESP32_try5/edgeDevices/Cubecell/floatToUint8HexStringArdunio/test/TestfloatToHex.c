#include <stdlib.h>
#include <stdint.h>
#include "floatToHex.h"
#include <unity.h>

void setUp(void)
{
}

void tearDown(void)
{
}

void test_floatToByte(void) {
   float number = -2.25;
   uint8_t message[32];
   floatToByte(number, message);
   TEST_ASSERT_EQUAL_UINT32(192, message[0]); 
   TEST_ASSERT_EQUAL_UINT32(16, message[1]);
   TEST_ASSERT_EQUAL_UINT32(0, message[2]);
   TEST_ASSERT_EQUAL_UINT32(0, message[3]);
}
