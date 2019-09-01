// 不存在变量提升

// 暂时性死区   TDZ=temporal dead zone
var tmp = 123;
if (true) {
    tmp = 'abc';    // ReferenceError
    let tmp;
}
// 不允许重复声明

// 块级作用域   意义上替代了使用函数作用域的立即执行函数IIFE

// 块级作用域中不要使用函数声明，应该写成函数表达式的形式

// do表达式[提案]
// let x = do {
//     let t = f();
//     t * t + 1;
// }

// const本质：保证变量指向的内存地址的指针是固定的，但是数据结构不能保证不可变 => const 声明对象

// es6的6种声明变量的方法
// var-function-let-const-import-class

// 顶层对象的属性与全局变量等价

// global对象[提案]全环境全支持顶部对象