// uuid的插入
const pi = []
let input = '4245501e-d52d76-3748ad87-23b41723-f3709898c99f'
let time = '1558689879456'
let p = '8979323846264338327950288419716939937510';           // 40位


function fib(n, ppre, pre) {
    if (n <= 1) {return ppre};
    return fib(n - 1, pre, ppre + pre);
}
// input string
// output 可以是一个或多个变量
function a (token, tokenTime = Date.now()) {
    var tokenArr = token.toString().split('');
    var thisArg = tokenTime.toString().slice(-2) % 40;
    var fibN = parseInt(tokenTime.toString().slice(-1)) + 85;
    var plusFib = fib(fibN, 1, 1).toString();
    // var dict = ''.padStart(16, plusFib.slice(thisArg) + plusFib.split('').reverse().join('')).split('').map(Number);
    var dict = (plusFib.slice(thisArg) + plusFib.split('').reverse().join('')).slice(0, 16).split('').map(Number);

    var i = 0;
    while (i < tokenArr.length) {
        let tmp16 = parseInt(tokenArr[i], 16);
        tokenArr[i] = tmp16 > -1 ? (tmp16 + dict[i % 16] + 40 + "") : '70';
        tokenArr[i] = String.fromCharCode(tokenArr[i]);
        i++;
    }
    tokenArr = tokenArr.join('');
    
    console.log(tokenArr)
    return {
        tokenArr,
        tokenTime
    };
}

const {tokenArr, tokenTime} = a(input);

// input function a的输出
// output function a的输入

function b (tokenArr, tokenTime) {
    var tokenArr = tokenArr.split('').map(a => a.charCodeAt() - 40);
    var thisArg = tokenTime.toString().slice(-2) % 40;
    var fibN = parseInt(tokenTime.toString().slice(-1)) + 85;
    var plusFib = fib(fibN, 1, 1).toString();
    // var dict = ''.padStart(16, plusFib.slice(thisArg) + plusFib.split('').reverse().join('')).split('').map(Number);
    var dict = (plusFib.slice(thisArg) + plusFib.split('').reverse().join('')).slice(0, 16).split('').map(Number);

    var i = 0;
    while (i < tokenArr.length) {
        tokenArr[i] = tokenArr[i] != 30 ? (tokenArr[i] - dict[i % 16]).toString(16) : '-';
        i++;
    }
    return tokenArr = tokenArr.join('');
}

console.log(b(tokenArr, tokenTime))




// var code = `function a () {
//     let a = 1,
//         b = 2,
//         c = 3,
//         d = 45;
//     return (a+b+c+d);
// }`
// var ast = require('esprima').parse(code);
// console.log(ast)