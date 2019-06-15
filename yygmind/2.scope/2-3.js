//  闭包面试题解

// 作用域
// 变量提升
var scope = 'global';
function scopeTest() {
    console.log(scope);
    var scope = 'local';
}
scopeTest();        // undefined
// 等价于
var scope="global";
function scopeTest(){
    var scope;
    console.log(scope);
    scope = "local"  
}
scopeTest(); //undefined