#!/bin/bash

make
for f in *.out; do
    valgrind -v --log-file="${f%.*}"_memory.txt ./$f
done
mkdir concatenateArray
cd src
for f in *c; do 
    cp "$f" "../concatenateArray/${f%.c}.cpp"
done
cp *.h ../concatenateArray/
cd ..
rm concatenateArray/main.cpp
cp src/library_properties/library.properties concatenateArray/
zip -r concatenateArray.zip concatenateArray/
