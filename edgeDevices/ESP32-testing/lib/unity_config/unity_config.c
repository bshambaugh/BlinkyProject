#include <stdio.h>
#include "unity_config.h"

void unityOutputStart() {}

void unityOutputChar(char c) {
    printf("%c", c);
}

void unityOutputFlush() {}

void unityOutputComplete() {}
