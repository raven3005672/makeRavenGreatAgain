// 闭包是指有权访问另外一个函数作用域中的变量的函数
// 关键在于：是一个函数、能访问另外一个函数作用域中的变量

// 关于闭包有下面三个特性
// 1、闭包可以访问当前函数以外的变量
function getOuter() {
    var date = '815';
    function getDate(str) {
        console.log(str + date);       // 访问外部的date
    }
    return getDate('今天是: ');         // 今天是：815
}
getOuter();
// 2、即使外部函数已经返回，闭包仍能访问外部函数定义的变量
function getOuter() {
    var date = '815';
    function getDate(str) {
        console.log(str + date);        // 访问外部的date
    }
    return getDate;                     // 外部函数返回
}
var today = getOuter();
today('今天是: ');          // 今天是：815
today('明天不是: ');        // 明天不是： 815
// 3、闭包可以更新外部变量的值
function updateCount() {
    var count = 0;
    function getCount(val) {
        count = val;
        console.log(count);
    }
    return getCount;        // 外部函数返回
}
var count = updateCount();
count(815);         // 815
count(816);         // 816


// 作用域链
// javascript中有一个执行上下文(execution context)的概念，它定义了变量或函数有权访问的其它数据，决定了他们各自的行为。每个执行环境都有一个与之关联的变量对象，环境中定义的所有变量和函数都保存在这个对象中。
// 当访问一个变量时，解释器会首先在当前作用域查找标识符，如果没与找到，就去父作用域找，知道找到该变量的标识符或者不在父作用域中，这就是作用域链。
// 作用域链和原型继承查找的区别：如果去查找一个普通对象的属性，但是在当前对象和其原型中都找不到时，会返回undefined；但查找的属性在作用域链中不存在的话就会抛出ReferenceError。

// 作用域链的顶端是全局对象，在全局环境中定义的变量就会绑定到全局对象中。


// 全局环境
// 无嵌套的函数
'use strict';
var foo = 1;
var bar = 2;
function myFunc() {
    var a = 1;
    var b = 2;
    var foo = 3;
    console.log('inside myFunc');
}
console.log('outside');
myFunc();
// 定义时：当muFunc被定义的时候，myFunc的标识符(identifier)就被加到了全局对象中，这个标识符所引用的是一个函数对象(myFunc function object).
// 内部属性[[scope]]指向当前的作用域对象，也就是函数的标识符被创建的时候，我们所能够直接访问的那个作用域对象(即全局对象)。
// 图2-1-1
// myFunc所引用的函数对象，其本身不仅仅含有函数的代码，并且还含有指向其被创建的时候的作用域对象。
// 调用时：当muFunc函数被调用的时候，一个新的作用域对象被创建了。新的作用域对象中包含myFunc函数所定义的本地变量，以及其参数(arguments)。这个新的作用域对象的父作用域对象就是运行myFunc时能直接访问的那个作用域对象(即全局对象)。
// 图2-1-2


// 有嵌套的函数
// 当函数返回没有被引用的时候，就会被垃圾回收器回收。但是对于闭包，即时外部函数返回了，函数对象仍会引用他被创建时的作用域对象。
'use strict';
function createCounter(initial) {
    var counter = initial;
    function increment(value) {
        counter += value;
    }
    function get() {
        return counter;
    }
    return {
        increment: increment,
        get: get
    }
}
var myCounter = createCounter(100);
console.log(myCounter.get());       // 返回100
myCounter.increment(5);
console.log(myCounter.get());       // 返回105
// 当调用createCounter(100)时，内嵌函数increment和get都指向createCounter(100)scope的引用。
// 假设createCounter(100)没有任何返回值，那么createCounter(100)scope不再被引用，于是就可以被垃圾回收。
// 图2-1-3
// 但是createCounter(100)实际上是有返回值的，并且返回值被存储在了myCounter中，所以对象之间的引用关系如下图。
// 图2-1-4
// 即使createCounter(100)已经返回，但是其作用域仍在，并且只能被内联函数访问。可以通过调用myCounter.increment()或myCounter.get()来直接访问createCounter(100)的作用域。
// 当myCounter.increment()或myCounter.get()被调用时，新的作用域对象会被创建，并且该作用域对象的父作用域对象会是当前可以直接访问的作用域对象。
// 调用gets()时，当执行到return counter时，在get()所在的作用域并没有找到对应的标识符，就会沿着作用域链往上找，直到找到变量counter，然后返回该变量。
// 图2-1-5
// 单独调用increment(5)时，参数value保存在当前的作用域对象。当函数要访问counter时，没有找到，于是沿着作用域链向上查找，在createCounter(100)的作用域找到了对应的标识符，increment()就会修改counter的值。
// 除此之外，没有其他方式来修改这个变量。必报的强大也在于此，能够存储私有数据。
// 图2-1-6

// 创建两个函数myCounter1和mycounter2
'use strict';
var myCounter1 = createCounter(100);
var myCounter2 = createCounter(200);
// myCounter1.increment和myCounter2.increment的函数对象拥有着一样的代码以及一样的属性值，但是它们的[[scope]]指向的是不一样的作用域对象。
// 图2-1-7


