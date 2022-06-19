#include <string.h>
#include <stdbool.h>
#include <stdio.h>
#include <string>
using namespace std;

// Modified https://stackoverflow.com/questions/15050766/comparing-the-values-of-char-arrays-in-c#15050807
// compares two character arrays to see if they have the same sequence of characters
// I might need to modify this to return a pointer or something...
bool char_sequence_compare(const char a[],const char b[]);

// the packet should only be parsed if the first character is 0, 1, or 2...the character length should be greater than or equal to two
void parse_packet(const string *source, string *type, string *curve, string *payload);

bool compareString(string s1, string s2);