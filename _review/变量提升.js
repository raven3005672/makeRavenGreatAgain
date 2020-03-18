var tmp = 1;
function f() {
    console.log(tmp);
    if (false) {
        var tmp = 2;
    }
}
f();        // undefined

// 函数声明——全部提升
console.log(foo);       // function() {}
var foo = 'xxx';
function foo() {}

// 函数表达式——只有变量提升
console.log(foo);       // undefined
var foo = 'xxx';
var foo = function() {}