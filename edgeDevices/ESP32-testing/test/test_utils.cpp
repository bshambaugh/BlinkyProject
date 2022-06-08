#include <unity.h>
#include <utils.h>
#include <string>
using namespace std;

void setUp(void) {
}

void tearDown(void) {

}

void test_char_sequence_compare_same_string(void) {
    char a[] = "AB";
    char b[] = "AB";

    TEST_ASSERT_TRUE(char_sequence_compare(a,b));
}

void test_char_sequence_compare_different_string(void) {
    char a[] = "AB";
    char b[] = "AC";

    TEST_ASSERT_FALSE(char_sequence_compare(a,b));
}

void test_char_sequence_compare_different_length(void) {
    char a[] = "AB";
    char b[] = "ABC";

    TEST_ASSERT_FALSE(char_sequence_compare(a,b));
}

void test_parse_packet_caseZero(void) {
    char type[5];
    char curve[5];
    char payload[200];
    string data = "01200f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb61cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24f";
    parse_packet(&data[0],type,curve,payload);
    TEST_ASSERT_EQUAL_STRING( "0", type );
    TEST_ASSERT_EQUAL_STRING( "1200", curve );
    TEST_ASSERT_EQUAL_STRING( "f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb61cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24f", payload );
}

void test_parse_packet_caseOne(void) {
    char type[5];
    char curve[5];
    char payload[200];
    string data = "11200f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb61cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24f";
    parse_packet(&data[0],type,curve,payload);
    TEST_ASSERT_EQUAL_STRING( "1", type );
    TEST_ASSERT_EQUAL_STRING( "1200", curve );
    TEST_ASSERT_EQUAL_STRING( "f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb61cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24f", payload );
}

void test_parse_packet_caseTwo(void) {
    char type[5];
    char curve[5];
    char payload[200];
    string data = "11200f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb61cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24f";
    parse_packet(&data[0],type,curve,payload);
    TEST_ASSERT_EQUAL_STRING( "2", type );
    TEST_ASSERT_EQUAL_STRING( "1200", curve );
    TEST_ASSERT_EQUAL_STRING( "f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb61cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24f", payload );
}

void test_parse_packet_caseThree(void) {
    char type[5];
    char curve[5];
    char payload[200];
    string data = "31200f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb61cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24f";
    parse_packet(&data[0],type,curve,payload);
    TEST_ASSERT_EQUAL_STRING( "3", type );
    TEST_ASSERT_EQUAL_STRING( "1200", curve );
    TEST_ASSERT_EQUAL_STRING( "f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb61cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24f", payload );
}

int main( int argc, char **argv) {
    UNITY_BEGIN();

    RUN_TEST(test_char_sequence_compare_same_string);
    RUN_TEST(test_char_sequence_compare_different_string);
    RUN_TEST(test_char_sequence_compare_different_length);
    RUN_TEST(test_parse_packet_caseZero);
    RUN_TEST(test_parse_packet_caseOne);
    RUN_TEST(test_parse_packet_caseTwo);
    RUN_TEST(test_parse_packet_caseThree);

    UNITY_END();

    return 0;
}