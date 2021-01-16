let publicKey = "f9c36f8964623378bdc068d4bce07ed17c8fa486f9ac0c2613ca3c8c306d7bb61cd36717b8ac5e4fea8ad23dc8d0783c2318ee4ad7a80db6e0026ad0b072a24f0";
console.log(publicKey.length - 1);
x = publicKey.slice(0,((publicKey.length - 1)/2));
y = publicKey.slice(((publicKey.length - 1)/2),(publicKey.length - 1));
console.log(x);
console.log(y);
