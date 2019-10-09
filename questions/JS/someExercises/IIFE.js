var b = 10;
(function b() {
    b = 20;
    console.log(b);
})();
// ƒ b() {
//     b = 20;
//     console.log(b);
// }



var b = 10;
(function b(b) {
    console.log(b);
    b = 20;
})(b);
// 10



var b = 10;
(function b() {
    var b = 20;
    console.log(b);
})();
// 20



var b = 10;
(function a() {
    b = 20;
    console.log(b);
})();
// 20



var b = 10;
(function () {
    b = 20;
    console.log(b);
})();
// 20



var a = 10;
(function () {
    console.log(a)
    a = 5
    console.log(window.a)
    var a = 20;
    console.log(a)
})()
// undefined/10/20
// 简单解析，IIFE内部变量声明提升，var a = undefined, 输出undefined，内部a=20，window.a外部作用域为10，内部a=20



var name = 'Tom';
(function() {
    if (typeof name == 'undefined') {
        var name = 'Jack';
        console.log('Goodbye ' + name);
    } else {
        console.log('Hello ' + name);
    }
})();
// var name提升，先undefined，再赋值
// Goodbye Jack



var name = 'Tom';
(function() {
    if (typeof name == 'undefined') {
        name = 'Jack';
        console.log('Goodbye ' + name);
    } else {
        console.log('Hello ' + name);
    }
})();
// 作用域链上找name
// Hello Tom

