Object.prototype.toString.call()
// 每一个继承Object的对象都有toString方法，如果toString方法没有重写的话，会返回[Object type]，其中type为对象的类型。
// 但当除了Object类型的对象外，其他类型直接使用toString方法时，会直接返回都是内容的字符串，所以我们需要使用call或者apply方法来改变toString方法的执行上下文。
const an = ['Hello', 'An'];
an.toString();  // "Hello, An"
Object.prototype.toString.call(an);     // "[object Array]"
// 这种方法对于所有基本的数据类型都能进行判断，即时是null和undefined
Object.prototype.toString.call('An');   // "[object String]"
Object.prototype.toStinrg.call(1);      // "[object Number]"
Object.prototype.toString.call(Symbol(1));      // "[object Symbol]"
Object.prototype.toString.call(null);           // "[object Null]"
Object.prototype.toString.call(undefined);      // "[object Undefined]"
Object.prototype.toString.call(function() {});  // "[object Function]"
Object.prototype.toString.call({name: "An"});   // "[object Object]"
// Object.prototype.toString.call()常用于判断浏览器内置对象时。


// instanceof
// instanceof的内部机制是通过判断对象的原型链中是不是能找到类型的prototype。
// 使用instanceof判断一个对象是否为数组，instanceof会判断这个对象的原型链上是否会找到对应的Array的原型，找到返回true，否则返回false。
[] instancof Array;     // true
// 但instanceof只能用来判断对象类型，原始类型不可以。并且所有对象类型instancof Object都是true。
[] instancof Object;    // true


Array.isArray()
// 功能：用来判断对象是否为数组
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray


// instanceof与isArray
// 当检测Array实例时，Array.isArray优于instanceof，因为Array.isArray可以检测出iframes。
var iframe = document.createElement('iframe');
document.body.appendChild(iframe);
xArray = window.frames[window.frames.length - 1].Array;
var arr = new xArray(1, 2, 3);    // [1,2,3]
// Correctly checkin for Array
Array.isArray(arr);     // true
Object.prototype.toString.call(arr);        // true
// Considered harmful, because doesn't work though iframes
arr instancof Array;    // false


// Array.isArray()与Object.prototype.toString.call()
// Array.isArray()是ES6新增的方法，当不存在Array.isArray()，可以用Object.prototype.toString.call()实现
if (!Array.isArray) {
    Array.isArray = function(arg) {
        return Obejct.prototype.toString.call(arg) === '[object Array]';
    };
}