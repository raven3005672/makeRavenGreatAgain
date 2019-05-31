// call语法
// func.call(thisArg, arg1, arg2, ...)，调用一个函数，其具有一个指定的this值和分别地提供的参数（参数的列表）
// apply语法
// func.apply(thisArg, [argsArray])，调用一个函数，以及作为一个数组（或类似数组对象）提供的参数。


// call核心
// 将函数设为对象的属性
// 执行&删除这个函数
// 指定this到函数并传入给定参数执行函数
// 如果不传入参数，默认指向为window
Function.prototype.call2 = function(content = window) {
    content.fn = this;
    let args = [...arguments].slice(1);
    let result = content.fn(...args);
    delete content.fn;
    return result;
}

var foo = {
    value: 1
}
function bar(name, age) {
    console.log(name);
    console.log(age);
    console.log(this.value)
}

bar.call(foo, 'black', '18')
bar.call2(foo, 'black', '18')

// apply
Function.prototype.apply2 = function(content = window) {
    content.fn = this;
    let result;
    if (arguments[1]) {
        result = content.fn(...arguments[1]);
    } else {
        result = content.fn();
    }
    delete content.fn;
    return result;
}

// bind
// bind方法会创建一个新函数。当这个新函数被调用时，bind的第一个参数将作为它运行时的this，之后的一序列参数将会在传递的实参前传入作为它的参数。
// 此外，bind实现需要考虑实例化后对原型链的影响。
Function.prototype.bind2 = function(content) {
    if (typeof this != "function") {
        throw Error("not a function");
    }
    let fn = this;
    let args = [...arguments].slice(1);
    let resFn = function() {
        console.log(this instanceof resFn);
        return fn.apply(this instanceof resFn ? this : content, args.concat(...arguments))
    }
    function tmp() {}
    tmp.prototype = this.prototype;
    resFn.prototype = new tmp();
    return resFn;
}
