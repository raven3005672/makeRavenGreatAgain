// call和apply原理、使用场景及实现

// call和apply的区别在于，call方法接受的是若干个参数的列表，而apply方法接受的是一个包含多个参数的数组
var func = function(arg1, arg2) {
    // ...
};
func.call(this, arg1, arg2);        // 使用call, 参数列表
func.apply(this, [arg1, arg2]);     // 使用apply，参数数组

// 使用场景
// 1.合并两个数组
var vegetables = ['parsnip', 'potato'];
var moreVegs = ['celery', 'beetroot'];
// 将第二个数组融合进第一个数组
// 相当于vegetables.push('celery', 'beetroot');
Array.prototype.push.apply(vegetables, moreVegs);   // 4
vegetables;     // ['parsnip', 'potato', 'celery', 'beetroot']
// 当第二个数组(moreVegs)太大时不要使用这个方法来合并数组，因为一个函数能够接受的参数个数是有限制的。
// 可以将参数数组切块后循环传入目标方法
function concatOfArray(arr1, arr2) {
    var QUANTUM = 32768;
    for (var i = 0, len = arr2.length; i < len; i += QUANTUM) {
        Array.prototype.push.apply(
            arr1,
            arr2.slice(i, Math.min(i + QUANTUM, len))
        )
    }
    return arr1;
}
// 验证代码
var arr1 = [-3, -2, -1];
var arr2 = [];
for (var i = 0; i < 1000000; i++) {
    arr2.push(i);
}
Array.prototype.push.apply(arr1, arr2);     // Uncaught RangeError: Maximum call stack size exceeded
concatOfArray(arr1, arr2);                  // (1000003) [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, ...]

// 2.获取数组中的最大值和最小值
var numbers = [5, 458, 120, -215];
Math.max.apply(Math, numbers);              // 458
Math.max.call(Math, 5, 458, 120, -215);     // 458
// ES6
Math.max.call(Math, ...numbers);            // 458
// 数组本身没有max方法，但是Math有，这里借助call/apply使用Math.max方法

// 3.验证是否是数组
function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}
isArray([1, 2, 3]);         // true
// 直接使用toString()
[1, 2, 3].toString();       // "1,2,3"
"123".toString();           // "123"
123.toString();             // Error
Number(123).toString();     // "123"
Object(123).toString();     // "123"
// 可以通过toString()来获取每个对象的类型，但是不同对象的toString()有不同的实现，所以通过Object.prototype.toString()来检测，需要以call/apply的形式来调用，传递要检查的对象作为第一个参数。

// 另一个检查是否是数组的方法
var toStr = Function.prototype.call.bind(Object.prototype.toString);
function isArray(obj) {
    return toStr(obj) === '[object Array]';
}
isArray([1, 2, 3]);         // true
// 使用改造后的toStr
toStr([1, 2, 3]);           // "[object Array]"
toStr("123");               // "[object String]"
toStr(123);                 // "[object Number]"
toStr(Object(123));         // "[object Number]"
// 上面方法首先使用Function.prototyp.call函数指定一个this值，然后.bind返回一个新的函数，始终将Object.prototype.toString设置为传入参数。其实等价于Object.prototype.toString.call()。
// 这里有一个前提是toString()方法没有被覆盖
// Object.prototype.toString = function() {
//     return '';
// }
// isArray([1, 2, 3]);         // false

// 4.类数组对象(Array-like OBject)使用数组方法
var domNodes = document.getElementsByName('*');
domNodes.unshif('h1');              // TypeError
var domNodeArrays = Array.prototype.slice.call(domNodes);
domNodeArrays.unshift('h1');        // ['h1', ...]
// 类数组对象有下面两个特性
// 具有指向对象元素的数字索引下标和length属性
// 不具有比如push、shift、forEach以及indexOf等数组对象具有的方法
// 需要说明的是，类数组对象是一个对象。JS中存在一种名为类数组的对象结构，比如arguments对象，还有DOM API返回的NodeList对象都属于类数组对象，类数组对象不能使用push/pop/shift/unshift等数组方法，通过Array.prototype.slice.call转换成真正的数组，就可以使用Array下所有方法。

// 类数组对象转数组的其他方法：
var arr = [].slice.call(arguments);
// ES6
let arr = Array.from(arguments);
let arr = [...arguments];
// Array.from可以将两类对象转为真正的数组：类数组对象和可遍历对象

// 扩展一：为什么通过Array.prototype.slice.call()就可以把类数组对象转换成数组
// 其实很简单，slice将Array-like对象通过下标操作放进了新的Array里面
// MDN关于slice的Polyfill
Array.prototype.slice = function(begin, end) {
    end = (typeof end !== 'undefined') ? end : this.length;
    // For array like object we handle it ourselves.
    var i, cloned = [], size, len = this.length;
    // Handle negative value for "begin"
    var start = begin || 0;
    start = (start >= 0) ? start : Math.max(0, len + start);
    // Handle negative value for "end"
    var upTo = (typeof end == 'number') ? Math.min(end, len) : len;
    if (end < 0) {
        upTo = len + end;
    }
    // Actual expected size of the slice
    size = upTo - start;
    if (size > 0) {
        cloned = new Array(size);
        if (this.charAt) {
            for (i = 0; i < size; i++) {
                cloned[i] = this.charAt(start + i);
            }
        } else {
            for (i = 0; i < size; i++) {
                cloned[i] = this[start + i];
            }
        }
    }
    return cloned;
};

// 扩展二：通过Array.prototype.slice.call()就足够了么？存在什么问题？
// 在低版本IE下不支持通过Array.prototype.slice.call(args)将类数组对象转换成数组，因为低版本IE（IE<9）下的DOM对象是以com对象的形式实现的，js对象与com对象不能进行转换。
function toArray(nodes) {
    try {
        // work in every browser except IE
        return Array.prototype.slice.call(nodes);
    } catch (err) {
        // Fails in IE < 9
        var arr = [],
            length = nodes.length;
        for (var i = 0; i < length; i++) {
            // arr.push(nodes[i]);      // 两种都可以
            arr[i] = nodes[i];
        }
        return arr;
    }
}

// 扩展三：为什么要有类数组对象？或者说类数组对象是为了解决什么问题才出现的？
// javascript类型化数组是一种类似数组的对象，并提供了一种用于访问原始二进制数据的机制。Array存储的对象能动态的增多和减少，并且可以存储任何javascript值。javascript引擎会做一些内部优化，以便对数组的操作可以很快。
// 然而，随着web应用程序变得越来越强大，尤其一些新增加的功能例如：音频视频编辑，访问WebSockets的原始数据等，很明显有些时候如果使用javascript代码可以快速方便地通过类型化数组来操作原始的二进制数据，这将会非常有帮助。
// 一句话就是，可以更快的操作复杂数据。

// 5.调用父构造函数实现继承
function SuperType() {
    this.color = ['red', 'green', 'blue'];
}
function SubType() {
    // 核心代码，继承自SuperType
    SuperType.call(this);
}
var instance1 = new SubType();
instance1.color.push('black');
console.log(instance1.color);       // ['red', 'green', 'blue', 'black']
var instance2 = new SubType();
console.log(instance2.color);       // ['red', 'green', 'blue']
// 在子构造函数中，通过调用父构造函数的call方法来实现继承，于是SubType的每个实例都会将SuperType中的属性复制一份。
// 缺点：只能继承父类的实例属性和方法，不能继承原型属性/方法；无法实现复用，每个子类都有父类实例函数的副本，影响性能。


// call的模拟实现
var value = 1;
var foo = {
    value: 1
};
function bar() {
    console.log(this.value);
}
bar.call(foo);      // 1
// call主要有一下两个点：call改变了this的指向，函数bar执行了

// 模拟实现第一步
// 如果在调用call()的时候把函数bar()添加到foo()对象中：
var foo = {
    value: 1,
    bar: function() {
        console.log(this.value);
    }
};
foo.bar();      // 1
// 这个改动就可以实现，改变了this的指向并且执行了函数bar。
// 但是这样写是有副作用的，即给foo额外添加了一个属性，所以要使用delete删掉。
// 1、将函数设置为对象的属性：foo.fn = bar
// 2、执行函数：foo.fn()
// 3、删除函数：delete foo.fn
Function.prototype.call2 = function(context) {
    // 首先要获取调用call的函数，用this可以获取
    context.fn = this;
    context.fn();
    delete context.fn;
}

// 模拟实现第二步
// 第一版有一个问题，那就是函数bar不能接收参数，所以我们可以从arguments中获取参数，取出第二个到最后一个参数放到数组中，为什么要抛弃第一个参数呢，因为第一个参数是this。
Function.prototype.call2 = function(context) {
    context.fn = this;
    var args = [];
    for (var i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']');
    }
    eval('context.fn(' + args + ')');
    delete context.fn;
}

// 模拟实现第三步
// 还有一些细节需要注意：
// 1.this参数可以传null或者undefined，此时this指向window
// 2.this参数可以传基本类型数据，原生的call会自动用Object()转换
// 3.函数是可以有返回值的
Function.prototype.call2 = function(context) {
    context = context ? Object(context) : window;
    context.fn = this;
    var args = [];
    for (var i = 0, len = arguments.length; i < len; i++) {
        args.push('argtumenst[' + i + ']');
    }
    var result = eval('context.fn(' + args + ')');
    delete context.fn;
    return result;
}


// call和apply模拟实现汇总
// call的模拟实现
// ES3
Function.prototype.call = function (context) {
    context = context ? Object(context) : window;
    context.fn = this;
    var args = [];
    for (var i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']');
    }
    var result = eval('context.fn(' + args + ')');
    delete context.fn;
    return result;
}
// ES6
Function.prototype.call = function (context) {
    context = context ? Object(context) : window;
    context.fn = this;
    let args = [...arguments].slice(1);
    let result = context.fn(...args);
    delete context.fn;
    return result;
}

// apply的模拟实现
// ES3
Function.prototype.apply = function (context, arr) {
    context = context ? Object(context) : window;
    context.fn = this;
    var result;
    // 判断是否存在第二个参数
    if (!arr) {
        result = context.fn();
    } else {
        var args = [];
        for (var i = 0, len = arr.length; i < len; i++) {
            args.push('arr[' + i + ']');
        }
        result = eval('context.fn(' + args + ')');
    }
    delete context.fn;
    return result;
}
// ES6
Function.prototype.apply = function(context, arr) {
    context = context ? Object(context) : window;
    context.fn = this;
    let result;
    if (!arr) {
        result = context.fn();
    } else {
        result = context.fn(...ar);
    }
    delete context.fn;
    return result;
}

// call和apply的模拟实现有没有问题？
// 这里假设context对象本身没有fn属性，我们必须保证fn属性的唯一性
function fnFactory(context) {
	var unique_fn = "fn";
    while (context.hasOwnProperty(unique_fn)) {
    	unique_fn = "fn" + Math.random(); // 循环判断并重新赋值
    }
    return unique_fn;
}
Function.prototype.call = function (context) {
    context = context ? Object(context) : window; 
    var fn = fnFactory(context); // added
    context[fn] = this; // changed

    var args = [];
    for(var i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']');
    }
    var result = eval('context[fn](' + args +')'); // changed

    delete context[fn]; // changed
    return result;
}
// ES6
Function.prototype.call = function (context) {
    context = context ? Object(context) : window; 
    var fn = Symbol(); // added
    context[fn] = this; // changed
  
    let args = [...arguments].slice(1);
    let result = context[fn](...args); // changed
  
    delete context[fn]; // changed
    return result;
}


// 有两种方案可以判断对象中是否存在某个属性
// in操作符
// in操作符会检查属性是否存在对象机器[[Prototype]]原型链中
// Object.hasOwnProperty
// hasOwnProperty只会检查属性是否存在对象中，不会向上检查其原型链

// 注意
// in操作符实际上是检查的某个属性名是否存在。
// 所有普通对象都可以通过Object.prototype的委托来访问hasOwnProperty，但是对于一些特殊对象(Object.create(null)创建)没有链接到Object.prototype，
// 这种情况必须使用Object.prototype.hasOwnProperty.call(obj, 'a')，显式绑定到obj上。

// 本期思考题
// 用js实现一个无线累加的函数add
// add(1);
// add(1)(2);
// add(1)(2)(3);

// 实现
function add(a) {
    // 使用闭包
    function sum(b) {
        // 累加
        a = a + b;
        return sum;
    }
    // 重写toString()方法
    sum.toString = function() {
        return a;
    }
    // 返回一个函数
    return sum;
}
