** First three voidUint8Array, voidCharArray, and mergeCharArray  #include <concatenateArray.h> **

Prototype: void voidUint8Array(int len, uint8_t a[]);

Before running:
uint8_t input[4] = { 30,  52, 236, 139 };

Running:
voidUint8Array(4, input);

After running:
uint8_t input[4] = { 0,  0, 0, 0 };

------------------------------------------------------------
Prototype: void voidCharArray(int len, char a[]);

Before running:
char input[4] = { 'A',  'B', 'C', 'D' };

Running:
voidCharArray(4, input);

After running:
char input[4] = { '\0',  '\0', '\0', '\0' }; // best guess from serial out on ESP32

------------------------------------------------------------
Prototype: void mergeCharArray(int len, unsigned char *message, char *a);

Before running:
unsigned char inputOne[4] = { 'A', 'B', 'C', 'D' };
char inputTwo[9] = {0};

Running:
mergeCharArray(4,inputOne,inputTwo);

After running:
char inputTwo[9] = { 'A', 'B', 'C', 'D', '\0', '\0', '\0', '\0', '\0' }; // best guess from serial out on ESP32


------------------------------------------------------------
** Second three compareString, char_sequence_compare, and hexCharacterStringToBytes #include <char_string_util.h> **

Prototype: bool compareString(const char* s1,const  char* s2);

Before running:
const char* expected = "abba1";
const char* actual = "abba";

Running:
compareString(expected,actual);

After Running:
0

Before running:
const char* expected = "abba";
const char* actual = "abba";

Running:
compareString(expected,actual);

Ater running:
1

Before running:
std::string expected = "ABBA";
std::string actual = "ABBA";

Running:
compareString(expected.c_str(),actual.c_str()

After running
1

------------------------------------------------------------
Prototype: bool char_sequence_compare(const char a[],const char b[]);

Before running:
const char* expected_str = "ABBA";
const char* actual_str = "abba";

Running:
char_sequence_compare(expected_str,actual_str);

After running:
0

Before running:
const char* expected_str = "ABBA";
const char* actual_str = "ABBA";

Running:
char_sequence_compare(expected_str,actual_str);

After running:
1

------------------------------------------------------------
Prototype: void hexCharacterStringToBytes(unsigned char *byteArray, const char *hexString);

Before running:
const uint8_t MaxByteArraySize = 32;
uint8_t byteArray[MaxByteArraySize] = {0};

string hashHex = "1e34ec8b07258a84df2f3a8fbbc17e9bd17e65a42154078fee578db9f5fc1150";
const char* stringHex_str = hashHex.c_str();

Running:
hexCharacterStringToBytes(byteArray,stringHex_str);

After running:

Before running:
const uint8_t MaxByteArraySize = 32;
uint8_t byteArray[MaxByteArraySize] = {0};

const char* stringHex_str = "1e34ec8b07258a84df2f3a8fbbc17e9bd17e65a42154078fee578db9f5fc1150";

Running:
hexCharacterStringToBytes(byteArray,stringHex_str);

After running:

byteArray = [ 30, 52, 236, 139, 7, 37, 138, 132, 223, 47, 58, 143, 187, 193, 126, 155, 209, 126, 101, 164, 33, 84, 7, 143, 238, 87, 141, 185, 245, 252, 17, 80 ];



