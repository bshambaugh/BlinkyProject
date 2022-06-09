#include <unity.h>
#include <utils.h>

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

void test_compare_string_true() {
     string s1 = "Gook";
     string s2 = "Gook";
     TEST_ASSERT_TRUE(compareString(s1,s2));
}

void test_compare_string_false() {
     string s1 = "Gook";
     string s2 = "Dook";
     TEST_ASSERT_FALSE(compareString(s1,s2));
}

void test_parse_packet_caseZero(void) {
    string data = "01200f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb61cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24f";
    string type = "";
    string curve = "";
    string payload = "";
    parse_packet(&data,&type,&curve,&payload);
    TEST_ASSERT_TRUE(compareString("0",type));
    TEST_ASSERT_TRUE(compareString("1200",curve));
    TEST_ASSERT_TRUE(compareString("f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb61cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24f",payload));
}

void test_parse_packet_caseOne(void) {
    string data = "11200f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb61cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24f";
    string type = "";
    string curve = "";
    string payload = "";
    parse_packet(&data,&type,&curve,&payload);
    TEST_ASSERT_TRUE(compareString("1",type));
    TEST_ASSERT_TRUE(compareString("1200",curve));
    TEST_ASSERT_TRUE(compareString("f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb61cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24f",payload));
}

void test_parse_packet_caseTwo(void) {
    string data = "21200f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb61cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24f";
    string type = "";
    string curve = "";
    string payload = "";
    parse_packet(&data,&type,&curve,&payload);
    TEST_ASSERT_TRUE(compareString("2",type));
    TEST_ASSERT_TRUE(compareString("1200",curve));
    TEST_ASSERT_TRUE(compareString("f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb61cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24f",payload));
}

void test_parse_packet_caseThree(void) {
    string data = "31200f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb61cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24f";
    string type = "";
    string curve = "";
    string payload = "";
    parse_packet(&data,&type,&curve,&payload);
    TEST_ASSERT_TRUE(compareString("3",type));
    TEST_ASSERT_TRUE(compareString("1200",curve));
    TEST_ASSERT_TRUE(compareString("f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb61cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24f",payload));
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
    RUN_TEST(test_compare_string_true);
    RUN_TEST(test_compare_string_false);

    UNITY_END();

    return 0;
}