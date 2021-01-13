
function grabLumens(str) {
   restwo = str.split("lumens: ");
   return  restwo[restwo.length - 1];
}

exports.grabLumens = grabLumens;
