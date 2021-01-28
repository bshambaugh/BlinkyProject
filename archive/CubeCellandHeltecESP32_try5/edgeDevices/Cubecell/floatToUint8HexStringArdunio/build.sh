#!/bin/bash

make
for f in *.out; do
    valgrind -v --log-file="${f%.*}"_memory.txt ./$f
done
mkdir floatToUint8HexStringArdunio
cd src
for f in *c; do 
    cp "$f" "../floatToUint8HexStringArdunio/${f%.c}.cpp"
done
cp *.h ../floatToUint8HexStringArdunio/
cd ..
rm floatToUint8HexStringArdunio/main.cpp
cp src/library_properties/library.properties floatToUint8HexStringArdunio/
zip -r floatToUint8HexStringArdunio.zip floatToUint8HexStringArdunio/
