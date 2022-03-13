var EC = require('elliptic').ec;
var ec = new EC('p521');
var key = ec.genKeyPair();
var pubPoint = key.getPublic();
var x = pubPoint.getX();
var y = pubPoint.getY();

var pub = { x: x.toString('hex'), y: y.toString('hex') };

console.log(pub);
