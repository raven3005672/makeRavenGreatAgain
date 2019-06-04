// https://github.com/yygmind/blog/issues/37

// 定义
// 函数柯里化又叫部分求值，维基百科对柯里化Currying的定义为：
// 在数学和计算机科学中，柯里化是一种将使用多个参数的函数转换成一系列使用一个参数的函数，并且返回接受余下的参数而且返回结果的新函数的技术。

// 只传递给函数一部分参数来调用它，让它返回一个新函数去处理剩下的参数。

// add函数举例
const add = (...args) => args.reduce((a, b) => a + b);
// 传入多个参数，执行add函数
add(1,2)        // 3
// 假设我们实现了一个currying函数，支持一次传入一个参数
let sum = currying(add);
// 封装第一个参数，方便重用
let addCurryOne = sum(1);
addCurryOne(2)      // 3
addCurryOne(3)      // 4


// 实际应用
// 1.延迟计算
const add = (...args) => args.reduce((a, b) => a + b);
// 简化写法
function currying(func) {
    const args = [];
    return function result(...rest) {
        if (rest.length === 0) {
            return func(...args);
        } else {
            args.push(...rest);
            return result;
        }
    }
}
const sum = currying(add);
sum(1,2)(3);        // 未真正求值【rest.length=1】
sum(4);             // 未真正求值【rest.length=1】
sum();
// 上面的代码理解起来很容易，就是用闭包把传入参数保存起来，当传入参数的数量足够执行函数时，就开始执行函数。
// 上面的currying函数是一种简化写法，判断传入的参数长度是否为0，若为0则执行函数，否则收集参数。

// 另一种常见的应用是bind函数
let obj = {
    name: 'muyiy'
};
const fun = function() {
    console.log(this.name);
}.bind(obj);
fun();      // muyiy
// 这里bind用来改变函数执行时候的上下文，但是函数本身并不执行，所以本质上是延迟计算，这一点和call/apply直接执行有所不同。

// bind的模拟实现，本身就一种柯里化，我们在最后的实现部分会发现，bind的模拟实现和柯里化函数的实现，其核心代码都是一致的。
Function.prototype.bind = function(context) {
    var self = this;
    // 第一个参数是指定的this，截取保存第一个之后的参数
    // arr.slice(begin); 即[begin, ... ,end]，去除context的其余全部参数
    var args = Array.prototype.slice.call(arguments, 1);

    return function () {
        // 此时的arguments是指bind返回的函数调用时接收的参数【bind结果函数的新传入参数】
        // 即return function的参数，和上面那个不同
        // 类数组转成数组
        var bindArgs = Array.prototype.slice.call(arguments);
        // 执行函数
        return self.apply(context, args.concat(bindArgs));
    }
}


// 2.动态创建函数
// 有一种典型的应用情景是这样的，每次调用函数都需要进行一次判断，但其实第一次判断计算之后，后续调用并不需要再次判断，这种情况下就非常适合使用柯里化方案来处理。
// 即第一次判断之后，动态创建一个新函数用于处理后续传入的参数，并返回这个新函数。当然也可以使用惰性函数来处理，本例最后一个方案会有所介绍。

// 我们看下面的这个例子，在DOM中添加事件时需要兼容现代浏览器和IE浏览器(IE<9)，方法就是对浏览器环境进行判断，看浏览器是否支持，简化写法如下：
function addEvent(type, el, fn, capture = false) {
    if (window.addEventListener) {
        el.addEventListener(type, fn, capture);
    } else if (window.attachEvent) {
        el.attachEvent('on' + type, fn);
    }
}
// 但是这种写法有一个问题，就是每次添加事件都会调用做一次判断，那么有没有什么办法只判断一次呢，可以利用闭包和立即调用函数表达式IIFE来处理。
const addEvent = (function() {
    if (window.addEventListener) {
        return function (type, el, fn, capture) {
            el.addEventListener(type, fn, capture);
        }
    } else if (window.attachEvent) {
        return function (type, el, fn) {
            el.attachEvent('on' + type, fn);
        }
    }
})();
// 上面这种实现方案就是一种典型的柯里化应用，在第一次的if...else if...判断之后完成部分计算，动态创建新的函数用于处理后续传入的参数，这样做的好处就是之后调用就不需要再次计算了。

// 当然可以使用惰性函数来实现这一功能，原理很简单，就是重新函数。
function addEvent(type, el, fn, capture = false) {
    if (window.addEventListener) {
        addEvent = function (type, el, fn, capture) {
            el.addEventListener(type, fn, capture);
        }
    } else if (window.attachEvent) {
        addEvent = function (type, el, fn) {
            el.attachEvent('on' + type, fn);
        }
    }
    // 执行函数，有循环爆栈风险
    addEvent(type, el, fn, capture);
}
// 第一次调用addEvent函数后，会进行一次环境判断，在这之后addEvent函数被重新，所以下次调用时就不会再次判断环境。


// 3.参数复用
// 我们知道调用toString()可以获取每个对象的类型，但是不同对象的toString()有不同的实现，所以需要通过Object.prototype.toString()来获取Object上的实现，同时以call/apply的形式来调用，并传递要检查的对象作为第一个参数。
function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}
function isNumber(obj) {
    return Object.prototype.toString.call(obj) === '[object Number]';
}
function isString(obj) {
    return Object.prototype.toString.call(obj) === '[object String]';
}
// 但是上面方案有一个问题，那就是每种类型都需要定义一个方法，这里我们可以使用bind来扩展，优点是可以直接使用改造后的toStr。
const toStr = Function.prototype.call.bind(Object.prototype.toString);
// 上面例子首先使用Function.prototype.call函数指定一个this值，然后.bind返回一个新的函数，始终将Object.prototype.toString设置为传入参数，其实等价于Object.prototype.toString.call()。



// 实现currying函数【*****IMPORTANT*****】
// 我们可以理解所谓的柯里化函数，就是封装一系列的处理步骤，通过闭包将参数集中起来计算，最后再把需要处理的参数传进去。
// 实现原理就是：用闭包把传入参数保存起来，当传入参数的数量足够执行函数时，就开始执行函数。

// 实现一个更加健壮的currying函数【此处需要加深理解】
function currying(fn, length) {
    length = length || fn.length;       // 第一次调用获取函数fn参数的长度，后续调用获取fn剩余参数的长度
    // 第一次执行之后都是下面返回的function，length是一个已经初始化过的值
    return function (...args) {         // currying包裹之后返回一个新函数，接收参数为...args
        return args.length >= length    // 新函数接受的参数长度是否大于fn剩余参数需要接收的长度
            ? fn.apply(this, args)      // 满足要求，执行fn函数，传入新函数的参数
            : currying(fn.bind(this, ...args), length - args.length)    // 不满足要求，递归currying函数，新的fn为bind返回的新函数(bind绑定了...args参数，未执行)，新的length为fn剩余参数的长度
    }
}
// test
const fn = currying(function(a,b,c) {
    console.log([a,b,c])
});

// ES6极简写法【同样加深理解】
const currying = fn =>
    judge = (...args) =>
        args.length >= fn.length
            ? fn(...args)
            : (...args) => judge(...args, ...arg)


// 扩展：函数参数length
// 函数currying的实现中，使用了fn.length来表示函数参数的个数。
// 函数的length属性获取的是形参的个数，但是形参的数量不包括剩余参数个数，而且仅包括第一个具有默认值之前的参数个数。
((a,b,c) => {}).length;     // 3
((a,b,c=3) => {}).length;   // 2
((a,b=2,c) => {}).length;   // 1
((a=1,b,c) => {}).length;   // 0
((...args) => {}).length;   // 0
const fn = (...args) => {
    console.log(args.length);
}
fn(1,2,3);           // 3
// 所以在柯里化的场景中，不建议使用ES6的函数参数默认值。
const fn = currying((a=1,b,c) => {
    console.log([a,b,c]);
});
fn();               // [1,undefined,undefined]
fn()(2)(3);         // Uncaught TypeError: fn(...) is not a function

