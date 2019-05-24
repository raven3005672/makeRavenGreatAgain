// 箭头函数：
// 函数体内的this对象，就是定义时所在的对象，而不是使用时所在的对象。
// 不可以使用arguments对象，该对象在函数体内不存在。
// 不可以使用yield命令，箭头函数不能用作generator函数。
// 不可以使用new命令，没有自己的this，无法调用call，apply；没有prototype属性；
// new命令在执行时需要将构造函数的prototype赋值给新的对象的__proto__。

// new过程大致如下
function newFunc(father, ...rest) {
    var result = {};
    result.__proto__ = father.prototype;
    var result2 = father.apply(result, rest);
    if ((typeof result2 === 'object' || typeof result2 === 'function') && result2 !== null) {
        return result2;
    }
    return result;
}