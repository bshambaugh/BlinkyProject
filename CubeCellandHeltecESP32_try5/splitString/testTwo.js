var str = "131,signature,b248aea7a7e9e507c710e59de1d9c816920cd13dbade3a63323c0f88f4baf193059f3f37ae0a7478c35c5de1e0a47d8605eb16a37414406449e932d35556899a";

let result = splitMessage(str);
console.log(result);
console.log(result[0]+" + "+result[1]+" + "+result[2]);

function splitMessage(str) {
  let  res = str.split(",");
  return res;
}
