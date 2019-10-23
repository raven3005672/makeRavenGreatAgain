// 不用加减乘除运算符，求整数的7倍

// 三类方式：位运算加法、JS hack、进制转换
// 位运算
// 先定义位运算加法
function bitAdd(m, n) {
    while (m) {
        [m, n] = [(m & n) << 1, m ^ n];
    }
}
// 位运算实现方式1 - 循环累加7次
let multiply7_bo_1 = (num) => {
    let sum = 0,
        counter = new Array(7);     // 得到[empty x 7]
    while (counter.length) {
        sum = bitAdd(sum, num);
        counter.shift();
    }
    return sum;
}
// 位运算实现方式2 - 二进制进3位(乘以8)以后，加自己的补码(乘以-1)
let multiply7_bo_2 = (num) => bitAdd(num << 3, -num);


// JS hack
// hack方式1 - 利用Function的构造器 & 乘号的字节码
let multiply7_hack_1 = (num) => {
    return new Function(["return ", num, String.fromCharCode(42), "7"].join(""))();
}
// hack方式2 - 利用eval执行器 & 乘号的字节码
let multiply7_hack_2 = (num) => {
    return eval([num, String.fromCharCode(42), "7"].join(""));
}
// hack方式3 - 利用setTimeout的参数 & 乘号的字节码
setTimeout(["window.multiply7_hack_3=(num)=>(7", String.fromCharCode(42), "num)"].join(""))


// 进制转换
// 进制转换方式 - 利用toString转为七进制整数，然后末尾补0(左移一位)后通过parseInt转回十进制
let multiply7_base7 = (num) => {
    return parseInt([num.toString(7), '0'].join(''), 7);
}