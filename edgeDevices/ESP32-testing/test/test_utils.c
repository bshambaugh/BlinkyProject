#include <unity.h>
#include "utils.h"

void test_char_sequence_compare() {
    char a[] = "AB";
    char b[] = "AB";

    TEST_ASSERT_TRUE(char_sequence_compare(a,b));
}

int main( int argc, char **argv) {
    UNITY_BEGIN();

    RUN_TEST(test_char_sequence_compare);

    UNITY_END();
}