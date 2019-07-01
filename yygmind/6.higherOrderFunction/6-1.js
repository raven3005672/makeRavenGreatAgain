// 高阶函数
// 高阶函数满足：接受一个或多个函数作为输入，输出一个函数

// 函数作为参数传递
Array.prototype.map
// map()方法创建一个新数组，其结果是该数组中的每个元素都调用一个提供的函数后返回的结果，原始数组不会改变。
// 传递给map的回调函数callback接受三个参数，分别是currentValue，index，array，除了callback之外还可以接受this值，用于执行callback函数时使用的this值。

Array.prototype.filter
// filter()方法创建一个新数组，其包含通过提供函数实现的测试的所有元素，原始数组不会改变。
// 接受的参数和map是一样的，其返回值是一个新数组，由通过测试的所有元素组成，如果没有任何数组元素通过测试，则返回空数组。

Array.prototype.reduce
// reduce()方法对数组中的每个元素执行一个提供的reducer函数（升序执行），将其结果汇总为单个返回值。
// 传递给reduce的回调函数（callback）接受四个参数，分别是累加器accumulator、currentValue、currentIndex、array，除了callback之外还可以接受初始值initialValue值。
// 如果没有提供initialValue，那么第一次调用callback函数时，accumulator使用原数组中的第一个元素，currentValue即是数组中的第二个元素。再没有初始值的空数组上调用reduce将报错。
// 如果提供了initialValue，那么将作为第一次调用callback函数时的第一个参数的值，即accumulator，currentValue使用原数组中的第一个元素。


// 函数作为返回值输出
// isType函数
let isType = type => obj => {
    return Object.prototype.toString.call(obj) === '[object ' + type + ']';
}
isType('String')('123');            // true
isType('Array')([1,2,3]);           // true
isType('Number')(123);              // true

// add函数
function add(a) {
    function sum(b) {
        a = a + b;
        return sum;
    }
    sum.toString = function() {
        return a;
    }
    return sum;
}
add(1);         // 1
add(1)(2);      // 3