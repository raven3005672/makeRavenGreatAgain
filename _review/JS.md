# JS原理相关

## new的实现原理是什么

1. 创建一个空对象obj
2. 将该对象 obj 的原型链 __proto__ 指向构造函数的原型 prototype，
    并且在原型链 __proto__ 上设置 构造函数 constructor 为要实例化的 Fn
3. 执行构造函数方法，属性和方法被添加到this引用的对象中
4. 如果构造函数没有返回其他对象，那么返回 obj ，否则返回构造函数中返回的对象

```js
function _new(Fn) {
    let target = {};
    target.__proto__ = Fn.prototype;
    target.__proto__.constructor = Fn;
    let args = Array.prototype.slice.call(arguments, 1);
    let result = Fn.apply(target, args);
    if (result && (typeof result == 'object' || typeof result == 'function')) {
        return result;
    }
    return target;
}
```

## 如何正确判断this的指向

一句话说明this的指向，即是：谁调用它，this就指向谁。

具体情况按照以下顺序判断：

### 全局环境中的this

* 浏览器环境：无论是否在严格模式下，在全局执行环境中（在任何函数体外部），this都指向全局对象 window
* node环境：无论是否在严格模式下，在全局执行环境中（在任何函数体外部），this都是空对象 {}

### 是否是 new 绑定

如果是 new 绑定，并且构造函数中没有返回function或者object，那么this指向这个新对象。

```js
function Super(age) {
    this.age = age;
}
let instance = new Super('26');
console.log(instance.age)       // 26

function Super(age) {
    this.age = age;
    let obj = {a: '2'};
    return obj;
}
let instance = new Super('hello');
console.log(instance)           // {a: '2'}
console.log(instance.age)       // undefined
```

### 函数是否通过call,apply调用，或者使用了bind绑定。如果是，那么this绑定的就是指定的对象【归结为显式绑定】

```js
function info() {
    console.log(this.age);
}
var person = {
    age: 20,
    info
}
var age = 28;
var info = person.info;
info.call(person);      // 20
info.apply(person);     // 20
info.bind(person)();    // 20
```

这里需要注意一种特殊情况，如果call,apply或者bind传入的第一个参数值是undefined或者null，严格模式下this的值为传入的的值null/undefined。非严格模式下，实际应用的默认绑定规则，this指向全局对象(node环境为global，浏览器环境为window)。

```js
function info() {
    console.log(this)
    console.log(this.age)
}
var person = {
    age: 20,
    info
}
var age = 28;
var info = person.info;
// 严格模式抛出错误
// 非严格模式，node环境输出undefined（全局变量不是挂载global上的）
// 非严格模式，浏览器环境输出28（全局变量挂载在window上）
info.call(null);
```

### 隐式绑定，函数的调用是在某个对象上触发的，即调用位置上存在上下文对象。典型的隐式调用为: xxx.fn()

```js
function info() {
    console.log(this.age);
}
var person = {
    age: 20,
    info
}
var age = 28;
person.info();  // 20
```

### 默认绑定，在不能应用其他绑定规则的时候使用的默认规则，通常是独立函数调用

* 非严格模式：node环境，执行全局对象global；浏览器环境，执行全局对象window
* 严格模式：执行undefined

```js
function info() {
    console.log(this.age)
}
var age = 28;
info();
```

### 箭头函数：箭头函数没有自己的this，继承外层上下文绑定的this。

```js
let obj = {
    age: 20,
    info: function() {
        return () => {
            console.log(this.age)
        }
    }
}
let person = {age: 28}
let info = obj.info();
info();     // 20
let info2 = obj.info.call(person)
info2();    // 28
```

## 深拷贝和浅拷贝的区别是什么

深拷贝和浅拷贝时针对复杂数据类型来说的，浅拷贝只拷贝一层，而深拷贝是层层拷贝。

* 深拷贝
    * 深拷贝赋值变量值，对于非基本类型的变量，则递归至基本类型变量后，再复制。深拷贝后的对象与原来的对象是完全隔离的，互不影响，对一个对象的修改并不会影响另一个对象。
* 浅拷贝
    * 浅拷贝是会将对象的每个属性进行依次赋值，但是当对象的属性值是引用类型时，实质赋值的是其引用，当引用指向的值改变时也会跟着变化。
    * 可以使用forin、Object.assign、扩展运算符...、Array.prototype.slice、Array.prototype.concat()等。

### 深拷贝实现

1. JSON方法-JSON.parse(JSON.stringify(obj))

存在的问题：

* 对象的属性值是函数时，无法拷贝
* 原型链上的属性无法拷贝
* 不能正确的处理Date类型的数据
* 不能处理RegExp
* 会忽略Symbol
* 会忽略undefined

2. 手写deepClone

* 如果是基本数据类型，直接返回
* 如果是RegExp或者Date类型，返回对应类型
* 如果是复杂数据类型，递归
* 考虑循环引用的问题

```js
// 注意：引入hash解决循环引用的问题！
function deepClone(obj, hash = new WeakMap()) {
    if (obj instanceof RegExp) return new RegExp(obj);
    if (obj instanceof Date) return new Date(obj);
    if (obj === null || typeof obj !== 'object') {
        // 不是复杂数据类型，直接返回
        return obj;
    }
    // 此处如果存在循环引用则直接返回hash保存的引用
    if (hash.has(obj)) {
        return hash.get(obj)
    }
    let t = new obj.constructor();
    hash.set(obj, t);
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) { // 是否是自身的属性
            t[key] = deepClone(obj[key], hash);
        }
    }
    return t;
}
```

## call/apply的实现原理

call和apply的功能相同，都是改变this的指向，并立即执行函数。区别在于传参方式不同。

```js
func.call(thisArgs, arg1, arg2, ...)
func.apply(thisArgs, [arg1, arg2, ...])
```

### 模拟实现call/apply

* 在call方法中获取调用call()函数
* 如果第一个参数没有传入，那么默认指向window/global（非严格模式）
* 传入call的第一个参数是this指向的对象，根据隐式绑定的规则，obj.foo()中的this指向obj，因此我们可以这样调用函数thisArgs.func(...args)
* 返回执行结果

```js
Function.prototype.call = function() {
    let [thisArg, ...args] = [...arguments];
    if (!thisArg) {
        thisArg = typeof window === 'undefined' ? global : window;
    }
    // this的指向的是当前函数func (func.call)
    thisArg.func = this;
    let result = thisArg.func(...args);
    delete thisArg.func;        // thisArg上并没有func属性，因此需要删除
    return result;
}
Function.prototype.apply = function(thisArg, rest) {
    let result;
    if (!thisArg) {
        thisArg = typeof window === 'undefined' ? global : window;
    }
    thisArg.func = this;
    if (!rest) {
        result = thisArg.func();
    } else {
        result = thisArg.func(...rest);
    }
    delete thisArg.func;
    return result;
}
```

## 柯里化函数实现

柯里化是把接受多个参数的函数变换成接受一个单一参数(最初函数的第一个参数)的函数，并且返回接受余下的参数而且返回结果的新函数的技术。

```js
const curry = (fn, ...args) => {
    return args.length < fn.length ?
        // 参数长度不足时，重新柯里化该函数，等待接受新参数
        (...arguments) => curry(fn, ...args, ...arguments) :
        // 参数长度满足时，执行函数
        fn(...args);
}
// 例子
function sumFn(a, b, c) {
    return a + b + c;
}
var sum = curry(sumFn);
sum(2)(3)(5)
sum(2, 3, 5)
sum(2)(3, 5)
sum(2, 3)(5)
```

函数柯里化的主要作用：

* 函数复用
* 提前返回 - 返回接受余下参数且返回结果的新函数
* 延迟执行 - 返回新函数，等待执行

### 无限参数加合

```js
function add() {
    var params = Array.prototype.slice.call(arguments);
    function currying() {
        var arr = Array.prototype.slice.call(arugments);
        params = params.concat(arr);
        return currying;
    }
    currying.toString = function() {
        return params.reduce((a, b) => {
            return a + b
        }, 0);
    }
    return currying;
}
add(1,2)
add(1)(2)(3,4,5)
```

## 如何让（a == 1 && a == 2 && a == 3）的值为true

1. 利用隐式类型转换

```js
let a = {
    [Symbol.toPrimitive]: (function() {
        let i = 1;
        return function() {
            return i++;
        }
    })(),
    valueOf: (function() {
        let i = 1;
        return function() {
            return i++;
        }
    })(),
    toString: (function() {
        let i = 1;
        return function() {
            return i++;
        }
    })
}
```

2. 利用数据劫持

```js
let i = 1;
let a = new Proxy({}, {
    i: 1,
    get: function() {
        return () => this.i++;
    }
})
```

3. 利用数组的toString接口默认调用数组的join方法，重写join方法

```js
let a = [1, 2, 3]
a.join = a.shift;
```

## ES5有几种方式可以实现继承？分别有哪些优缺点

一共有6种方式：原型链继承、借用构造函数、组合继承（原型链+借用构造函数）、原型式继承、寄生式继承、寄生组合式继承

极简

```js
function Father() {}
function Child() {}
// 1。原型
Child.prototype = new Father()
// 2.构造
function Child(name) {
    Father.call(this, name)
}
// 3.组合
function Child(name) {
    Father.call(this, name)
}
Child.prototype = new Father()
// 4.寄生
function cloneObj(o) {
    var clone = Object.create(o);
    clone.sayName = '...'
    return clone;
}
```

### 原型链继承

原型链继承的基本思想是利用原型让一个引用类型继承另一个引用类型的属性和方法。

function a() {}
a.prototype = new A();
a.prototype.constructor = a;

```js
function SuperType() {
    this.name = 'Yvette';
    this.colors = ['pink', 'blue', 'green']
}
SuperType.prototype.getName = function() {
    return this.name;
}
function SubType() {
    this.age = 22;
}
SubType.prototype = new SuperType();
SubType.prototype.getAge = function() {
    return this.age;
}
SubType.prototype.constructor = SubType;
let instance1 = new SubType();
instance1.colors.push('red');
console.log(instance1.getName());
console.log(instance1.colors.length);       // 4
let instance2 = new SubType();
console.log(instance2.colors.length);       // 4
```

缺点：

1. 通过原型实现继承，原型会变成另一个类型的实例，原先的实例属性变成了现在的原型属性，该原型的引用类型属性会被所有实例共享。
2. 创建子类型的实例时，没有办法在不影响所有对象实例的情况下给超类型的构造函数中传递参数。

### 借用构造函数

借用构造函数的技术，其基本思想是：在子类型的构造函数中调用超类型构造函数。

function a(args) {
    A.call(this, args)
}
a1 = new a();

```js
function SuperType(name) {
    this.name = name;
    this.colors = [1,2,3]
}
function SubType(name) {
    SuperType.call(this, name);
}
let instance1 = new SubType('zzz')
instance1.colors.push('red');
console.log(instance1.colors.length);       // 4
let instance2 = new SubType('xxx')
console.log(instance2.colors.length);       // 3
```

优点：
1. 可以向超类传递参数
2. 解决了原型中包含引用类型值被所有实例共享的问题

缺点：
1. 方法都在构造函数中定义，函数复用无从谈起，另外超类型原型中定义的方法对于子类型而言都是不可见的

### 组合继承（原型链 + 借用构造函数）

基本思路：使用原型链实现对原型属性和方法的继承，通过借用构造函数来实现对实例属性的继承。

既通过在原型上定义方法来实现了函数复用，又保证了每个实例都有自己的属性。

function a() {
    A.call(this, args);
}
a.prototype = new A();
a.prototype.constructor = a;

```js
function SuperType(name) {
    this.name = name;
    this.colors = [1,2,3]
}
SuperType.prototype.sayName = function() {
    console.log(this.name);
}
function SuberType(name, age) {
    SuperType.call(this, name);
    this.age = age;
}
SuberType.prototype = new SuperType()
SuberType.prototype.constructor = SuberType;
SuberType.prototype.sayAge = function() {
    console.log(this.age);
}
let instance1 = new SuberType('a',1);
instance1.colors.push('red');
console.log(instance1.colors.length);       // 4
instance1.sayName();        // 'a'
let instance2 = new SuberType('b',2);
console.log(instance2.colors.length);       // 3
instance2.sayName();        // 'b'
```

优点：
可以向超类传递参数。
每个实例都有自己的属性。
实现了函数复用。

缺点：
无论什么情况下，都会调用两次超类型的构造函数：一次是在创建子类型原型的时候，另一次是在子类型构造函数内部。

### 原型式继承

借助原型可以基于已有的对象创建新对象，同时还不必因此创建自定义类型。

```js
function object(o) {
    function F() {}
    F.prototype = o;
    return new F();
}
```

object()函数内部，先创建一个临时性的构造函数，然后将传入的对象作为这个构造函数的原型，最后返回了这个临时类型的一个新实例，从本质上讲，object()对传入的对象执行了一次浅拷贝。

Object.create()方法规范了原型式继承。这个方法接收两个参数：一个作为新对象的原型的对象，（可选的）一个为新对象定义额外属性的对象（可以覆盖原型对象上的同名属性），在传入一个参数的情况下，Object.create()和object()方法的行为相同。

```js
var person = {
    name: 'xxx',
    hobbies: [1,2,3]
}
var person1 = Object.create(person);
person1.hobbies.push(4);
console.log(person.hobbies.length);     // 4
```

缺点：
同原型链继承一样，包含引用类型值的属性会被所有实例共享

### 寄生式继承

寄生式继承是与原型式继承紧密相关的一种思路。寄生式继承的思路与寄生构造函数和工厂模式类似，即创建一个仅用于封装继承过程的函数，该函数在内部已某种方式来增强对象，最后再像真地是它做了所有工作一样返回对象。

```js
function createAnother(original) {
    var clone = Object.create(original);
    clone.sayHi = function() {
        console.log('hi')
    }
    return clone
}
var person = {
    name: 'xxx',
    hobbies: [1,2,3]
}
var person2 = createAnother(person);
person.sayHi();
```

基于person返回了一个新对象——person2，新对象不仅具有person的所有属性和方法，而且还有自己的sayHi()方法。在考虑对象而不是自定义类型和构造函数的情况下，寄生式继承也是一种有用的模式。

缺点：
使用寄生式继承来为对象添加函数，会由于不能做到函数复用而效率低下。
同原型链实现继承一样，包含引用类型值的属性会被所有实例共享。

### 寄生组合式继承

所谓寄生组合式继承，即通过借用构造函数来继承属性，通过原型链的混成形式来继承方法，基本思路：

不必为了制定子类型的原型而调用超类型的构造函数，我们需要的仅是超类型原型的一个副本，本质上就是使用寄生式继承来继承超类型的原型，然后再将结果执行给子类型的原型。寄生组合式继承的基本模式如下：

* 创建超类型原型的一个副本
* 为创建的副本添加constructor属性
* 将新创建的对象赋值给子类型的原型

```js
function inheritPrototype(subType, superType) {
    var prototype = Object.create(superType.prototype);
    prototype.constructor = subType;
    subType.prototype = prototype;
}
function SuperType(name) [
    this.name = name;
    this.colors = [1,2,3]
]
function SuberType(name, age) {
    SuperType.call(this, name)
    this.age = age
}
inheritPrototype(SuberType, SuperType);
```

优点：
只调用了一次超类构造函数，效率更高。避免在SuberType.constructor上面创建不必要的、多余的属性，与此同时，原型链还能保持不变。

寄生组合继承是引用类型最理想的继承方式。

## var、let、const

声明方式 | 变量提升 | 暂时性死区 | 重复声明 | 块作用域有效
- | - | - | - | -
var | 会 | 不存在 | 允许 | 不是
let | 不会 | 存在 | 不允许 | 是
const | 不会 | 存在 | 不允许 | 是

const声明变量时必须设置初始值。

const声明一个只读的常量，这个常量不可改变。

复杂数据类型，存储在栈中的是堆内存的地址，存在栈中的这个地址是不变的，但是存在堆中的值是可以变的。

## JS执行上下文栈和作用域链

### JS执行上下文

执行上下文就是当前Js代码被解析和执行时所在环境的抽象概念，Js中运行任何代码都是在执行上下文中运行。

全局执行上下文、函数执行上下文。

执行上下文创建过程中，需要做一下几件事：

1. 创建变量对象：首先初始化函数的参数arguments，提升函数声明和变量声明。
2. 创建作用域链：在执行期上下文的创建阶段，作用域链是在变量对象之后创建的。
3. 确定this的值

### 作用域

作用域负责收集和维护有所有声明的标识符（变量）组成的一系列查询，并实施一套非常严格的规则，确定当前执行的代码对这些标识符的访问权限。

作用域有两种工作模型：词法作用域和动态作用域，Js采用的是词法作用域工作模型，词法作用域意味着作用域是由书写代码时变量和函数声明的位置决定的。

全局作用域、函数作用域、块级作用域。

### JS执行上下文栈

执行栈，也叫做调用栈，具有后进先出结构，用于存储在代码执行期间创建的所有执行上下文。

* 首次运行js代码的时候，会创建一个全局执行的上下文并Push到当前的执行栈中，每当发生函数调用，引擎都会为该函数创建一个新的函数执行上下文并Push到当前执行栈的栈顶。
* 当栈顶的函数运行完成后，其对应的函数执行上下文将会从执行栈中Pop出，上下文的控制权将移动到当前执行栈的下一个执行上下文。

### 作用域链

作用域链就是从当前作用域开始一层一层向上寻找某个变量，直到找到全局作用域还是没有找到，就宣布放弃。这种一层一层的关系，就是作用域链。

## 防抖函数的作用，实现一个防抖函数。

防抖函数的作用就是控制函数在一定时间内的执行次数。防抖意味着n秒内函数只会被执行一次，如果n秒内再次被触发，则重新计算延迟时间。

1. 事件第一次触发时，timer是null，调用later()，若immediate为true，那么立即调用func.apply(this, params);如果immediate为false，那么过wait之后，调用func.apply(this, params);
2. 事件第二次触发时，如果timer已经重置为null（即setTimeout的倒计时结束），那么流程与第一次触发时一样，若timer不为null（即setTimeout的倒计时未结束），那么清空定时器，重新开始计时。

```js
// 简单版
function debounce(fn) {
    let timeout = null;
    return function() {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn.apply(this, arguments);
        }, 500);
    }
}
```

```js
// 复杂版
function debounce(func, wait = 500, immediate = true) {
    let timeout, result;
    // 延迟执行函数
    const later = (context, args) => setTimeout(() => {
        timeout = null;
        if (!immediate) {
            result = func.apply(context, args);
            context = args = null;
        }
    }, wait);
    let debounced = function(...params) {
        if (!timeout) {
            timeout = later(this, params);
            if (immediate) {
                // 立即执行
                result = func.apply(this, params);
            }
        } else {
            clearTimeout(timeout);
            // 函数在每个等待时延的结束被调用
            timeout = later(this, params);
        }
        return result;
    }
    // 提供在外部清空定时器的方法
    debounced.cancel = function() {
        clearTimeout(timer);
        timer = null;
    }
    return debounced;
}
// immediate为true时，表示函数在每个等待时延的开始被调用，immediate为false时，表示函数在每个等待时延的结束被调用。
```

应用场景：

* 搜索框输入查询，如果用户一直在输入中，没有必要不停的调用去请求服务端接口，等用户停止输入的时候，再调用，设置一个合适的时间间隔，有效减轻服务端压力。
* 表单验证
* 按钮提交事件
* 浏览器窗口缩放，resize事件（如串口停止改变大小之后重新计算布局）等

## 节流函数的作用，实现一个节流函数

节流函数的作用是规定一个单位事件，在这个单位时间内最多只能触发一次函数执行，如果这个单位时间内多次触发，只能有一次生效。

```js
// 简单版
function throttle(fn) {
    let canRun = true;
    return function() {
        if (!canRun) return;
        canRun = false;
        setTimeout(() => {
            fn.apply(this, arguments);
            canRun = true;
        }, 500);
    }
}
```

```js
// 复杂版
function throttle(func, wait, options = {}) {
    var timeout, context, args, result;
    var previous = 0;
    var later = function() {
        previous = options.leading === false ? 0 : (Date.now() || new Date().getTime());
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
    }
    var throttled = function() {
        var now = Date.now() || new Date().getTime();
        if (!previous && options.leading === false) previous = now;
        // remaining 为距离下次执行func的时间
        // remaining > wait，表示客户端系统时间被调整过
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        // remaining小于等于0，表示事件触发的时间间隔大于设置的wait
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                // 清空定时器
                clearTimeout(timeout);
                timeout = null;
            }
            // 重置previous
            previous = now;
            // 执行函数
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    }
    throttled.cancel = function() {
        clearTimeout(timeout);
        previous = 0;
        timeout = context = args = null;
    }
    return throttled;
}
```

节流的应用场景：

* 按钮点击事件
* 拖拽事件
* onScroll
* 计算鼠标移动的距离（mousemove）

## 什么是闭包，闭包的作用是什么？

闭包的定义：

* 闭包是指有权访问另一个函数作用域中的变量的函数。
* 从技术的角度将，所有的js函数都是闭包：它们都是对象，它们都关联到作用域链。
* 当函数可以记住并访问所在的词法作用域时，就产生了闭包，即使函数是在当前词法作用域之外执行。

```js
// 创建一个闭包
function foo() {
    var a = 2;
    return function fn() {
        console.log(a);
    }
}
let func = foo();
func();     // 2
```

闭包是的函数可以继续访问定义时的此法作用域，拜fn所赐，在foo执行()执行后，foo内部作用域不会被销毁。

闭包的作用：

* 能够访问函数定义时所在的词法作用域(阻止其被回收)
* 私有化变量
* 模拟块级作用域
* 创建模块

模块模式具有两个必备的条件：

* 必须有外部的封闭函数，该函数必须至少被调用一次（每次调用都会创建一个新的模块实例）
* 封闭函数必须返回至少一个内部函数，这样内部函数才能在私有作用域中形成闭包，并且可以访问或者修改私有的状态

## 实现Promise.all方法

Promise.all(iterable)的功能，返回一个新的Promise实例。此实例在iterable参数内所有的promise都fulfilled或者参数中不包含promise时，状态变成fulfilled；如果参数中promise有一个失败rejected，此实例回调失败，失败原因的是第一个失败promise的返回结果。

```js
let p = Promise.all([p1,p2,p3])
```

* 如果传入的参数为空的可迭代对象，Promise.all会 同步 返回一个已完成状态的promise
* 如果传入的参数中不包含任何promise，Promise.all会 异步 返回一个已完成状态的promise
* 其它情况下，Promise.all返回一个处理中(pending)状态的promise

* 如果传入的参数中的promise都变成完成状态，Promise.all返回的promise异步地变为完成
* 如果传入的参数中，有一个promise失败，Promise.all异步地将失败的那个结果给失败状态的回调函数，而不管其它promise是否完成
* 在任何情况下，Promise.all返回的promise的完成状态的结果都是一个数组

```js
Promise.all = function(promises) {
    // promises是可迭代对象，省略参数合法性校验
    return new Promise((resolve, reject) => {
        if (promises.length === 0) {
            resolve([]);
        } else {
            let result = [];
            let index = 0;
            for (let i = 0; i < promises.length; i++) {
                // 考虑到i可能是thenable对象也可能是普通值
                Promise.resolve(promises[i]).then(data => {
                    result[i] = data;
                    if (++index === promise.length) {
                        // 所有的promise状态都是fulfilled
                        resolve(result);
                    }
                }, err => {
                    reject(err);
                    return;
                });
            }
        }
    });
}
```

## promise.race实现

```js
Promise.race = function(promises) {
    return new Promise((resolve, reject) => {
        if (promises.length === 0) {
            return;
        } else {
            for (let i = 0; i < promises.length; i++) {
                Promise.resolve(promises[i]).then(data => {
                    resolve(data);
                    return;
                }, err => {
                    reject(err);
                    return;
                })
            }
        }
    })
}
```

## promise.finally实现

```js
Promise.prototype.finally = function (callback) {
    return this.then(
        value => Promise.resolve(callback()).then(() => value),
        err => Promise.resolve(callback()).then(() => { throw err })
    )
}
```

## 数组扁平化

```js
// Array.prototye.flat
function flattenDeep(arr) {
    // Array.prototype.flat默认拉平1层，传递深度参数可以拉平多层
    return arr.flat(Math.pow(2, 53) - 1);
}

// reduce和concat
function flattenDeep(arr) {
    return arr.reduce((pre, cur) => {
        if (Array.isArray(cur)) {
            cur = flattenDeep(cur);
        }
        return pre.concat(cur)
    }, []);
}

// stack无限反嵌套
function flattenDeep(arr) {
    let result = [];
    let stack = [...arr];
    while(stack.length) {
        const next = stack.pop();
        if (Array.isArray(next)) {
            stack.push(...next);
        } else {
            res.push(next);
        }
    }
    // 使用reverse回复原数组的顺序
    return res.reverse();
}

flattenDeep([1,2,[3,4,[5]]]);
```

## 数组去重

```js
// Set
function uniq(arr) {
    // return Array.from(new Set(arr))
    return [...new Set(arr)]
}
// indexOf
function uniq(arr) {
    var result = [];
    for (var i = 0; i < arr.length; i++) {
        if (result.indexOf(arr[i]) === -1) {
            result.push(arr[i]);
        }
    }
    return result;
}
// includes
function uniq(arr) {
    var result = [];
    for (var i = 0; i < arr.length; i++) {
        if (!result.includes(arr[i])) {
            result.push(arr[i]);
        }
    }
    return result;
}
// reduce
function uniq(arr) {
    return arr.reduce((prev, cur) => {
        return prev.includes(cur) ? prev : [...prev, cur]
    }, []);
}
// Map
function uniq(arr) {
    let map = new Map();
    let result = [];
    for (let i = 0; i < arr.length; i++) {
        if (map.has(arr[i])) {
            map.set(arr[i], true);
        } else {
            map.set(arr[i], false);
            result.push(arr[i]);
        }
    }
    return result;
}
uniq([1,1,2,3,4,5,6])
```

## 可迭代对象有哪些特点

ES6规定，默认的Iterator接口部署在数据结构的Symbol.iterator属性，换个角度，也可以认为，一个数据结构只要有Symbol.iterator属性（Symbol.iterator方法对应的是遍历器生成函数，返回的是一个遍历器对象），那么就可以认为其实可迭代的。

* 具有Symbol.iterator属性，Symbol.iterator()返回的是一个遍历器对象
* 可以使用for...of进行循环
* 通过被Array.from转换为数组

```js
let arr = [1,2,3,4]
let iter = arr[Symbol.iterator]();
iter.next();      // {value:1, done:false}
iter.next();      // {value:2, done:false}
iter.next();      // {value:3, done:false}
```

原生具有Iterator接口的数据结构：

* Array
* Map
* Set
* String
* TypedArray
* 函数的arguments对象
* NodeList对象

## 事件委托

在DOM树上绑定事件监听器并使用JS事件处理程序是处理客户端事件响应的典型方法。从理论上讲，我们可以将监听器附加到html的任何dom元素，但由于事件委派，这样做是浪费并且没有必要的。

事件委托是一种让父元素上的事件监听器也影响子元素的技巧。通常，事件传播（捕获和冒泡）允许我们实现事件委托。冒泡意味着当触发子元素（目标）时，也可以逐层触发该子元素的父元素，直到它碰到DOM绑定的原始监听器（当前目标）。捕获属性将事件阶段转换为捕获阶段，让事件下移到元素，因此，触发方向与冒泡阶段相反。捕获的默认值为false。

阻止事件冒泡：event.cancelBubble或event.stopPropagation

## 严格模式

略

## null和undefined

* undefined：尚未初始化
* null：空值

## 基本数据类型

* String
* Number
* Boolean
* Null
* Undefined
* Symbol

引用数据类型：Object/Array/Function

## 原型

构造函数，是一种特殊的方法。主要用来在创建对象时初始化对象。每个构造函数都有prototype(原型)属性，每个函数都有prototype(原型)属性，这个属性是一个指针，指向一个对象。

这个对象的用途是包含特定类型的所有实例共享的属性和方法，即这个原型对象是用来给实例共享属性和方法的。而每个实例内部都有一个指向原型对象的指针。

## 性能优化

babel-loader用include或exclude避免不必要的转译，不转译node_modules中的js文件
缓存当前转译的js文件没设置loader: 'bebel-loader?cacheDirectory=true'
文件采用按需加载等等
数据压缩，request headers中加上accept-encoding: gzip
图片优化，采用svg图片或者字体图标
浏览器缓存机制，强缓存与协商缓存

## 输出

```js
var a = {x: 1};
var b = a;
a = a.x = { x: 1 };
console.log(a, b);
// a: {x: 1}, b: {x: {x: 1}}
```

## generator

Generator函数是一个状态机

```js
function* helloWorldGenerator() {
    yield 'hello';
    yield 'world';
    return 'ending';
}
var hw = helloWorldGenerator();
hw.next()
// { value: 'hello', done: false }
hw.next()
// { value: 'world', done: false }
hw.next()
// { value: 'ending', done: true }
hw.next()
// { value: undefined, done: true }
```

## 手写promise实现

```js
var myPormise = new Promise((resolve, reject) => {
    if (/* true */) {
        resolve(value)
    } else if (/* false */) {
        reject(error)
    }
})
myPromise.then((value) => {
    // 成功后回调，value
}, (error) => {
    // 失败后调用，error
}).catch();
```

优点：决绝回调地狱，对异步任务写法更加标准化和简洁化
缺点：首先，无法取消Promise，一旦新建它就会立即执行，无法中途取消；其次，如果不设置回调函数，Promise内部抛出的错误，不会反映到外部；第三，当处于pending状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）

```js
function promise() {
    this.msa = '';
    this.status = 'pending';
    var that = this;
    var process = arguments[0];

    process(function() {
        that.status = 'fulfilled';
        that.msg = arguments[0]
    }, function() {
        thath.status = 'rejected';
        thah.msg = arguments[0]
    })
    return this
}
promise.prototype.then = function() {
    if (this.status === 'fulfilled') {
        arguments[0](this.msg);
    } else if (this.status === 'rejected' && arguments[1]) {
        arguments[1](this.msg);
    }
}
```

## 观察者模式 & 发布订阅模式

观察者模式：观察者知道Subject，Subject对观察者进行记录。一般是同步的。

```js
// 观察者模式
class Subject() {
    constructor() {
        this.Observers = [];
    }
    add(observer) {
        this.Observers.push(observer)
    }
    remove(observer) {
        this.Observers = this.Observers.filter(item => item === observer)
    }
    notify() {
        this.Oberservers.forEach(item => {
            item.update();
        })
    }
}
class Observer {
    constructor(name) {
        this.name = name;
    }
    update() {
        console.log(this.name)
    }
}
```

发布订阅模式：发布者和订阅者付不知道对方存在，只通过消息代理进行通信。一般是异步的【消息队列】

```js
// 最好参考eventEmitter
let pubSub = {
    subs: {},
    subscribe(key, fn) {
        if (!this.subs[key]) {
            this.subs[key] = [];
        }
        this.subs[key].push(fn);
    },
    publish(key, ...arg) {
        let fns = this.subs[key];
        if (!fns || fns.length <= 0) {
            return;
        }
        for (let i = 0; i < fns.length; i++) {
            fns[i](...arg)
        }
    },
    unsubscribe(key) {
        delete this.subs[key]
    }
}
```

## 手写bind

```js
Function.prototype._bind = function() {
    let self = this;
    let context = Array.prototype.shift.call(arguments)
    let args = Array.prototype.slice.call(arguments)
    return function() {
        self.apply(context, Array.prototype.concat.call(args, Array.prototype.slice.call(arguments)))
    }
}
```

## async-await

* Generator函数的语法糖，将*改成async，yield改成await
* 是对Generator函数的改进，返回promise
* 异步写法同步化，遇到await先返回，执行完异步再执行接下来的
* 内置执行器，无需next()

## 手动实现map

```js
// for循环实现
Array.prototype._map = function() {
    var arr = this;
    var [fn, thisValue] = Array.prototype.slice.call(arguments);
    var result = [];
    for (var i = 0; i < arr.length; i++) {
        result.push(fn.call(thisValue, arr[i], i, arr))
    }
    return result;
}
// forEach实现
Array.prototype._map = function(fn, thisValue) {
    var arr = this;
    this.forEach((v, i, arr) => {
        result.push(fn.call(thisValue, v, i, arr))
    });
    return result;
}
```

## 对原型链的理解

* 在js里，继承机制是原型继承。继承的起点是对象的原型
* 一切皆为对象，只要是对象，就会有proto属性，该属性存储了指向其构造函数的指针
* Object.prototype也是对象，其proto指向null
* 对象分两种：函数对象和普通对象，只有函数对象拥有原型对象
* prototype的本质是普通对象
* Function.prototype比较特殊，是没有prototype的函数对象
* new操作得到的对象是普通对象
* 当调用一个对象的属性时，会先在本身查找，若无，就根据proto找到构造原型，若无，则继续往上找。最后会打到顶层Object.prototype，他的proto指向null，均无结果则返回undefined，结束。
* 有proto串起的路径就是原型链
* 通过prototype可以给所有子类共享属性

## sleep函数

```js
function sleep(delay) {
    var start = Date.now();
    while (Date.now() - start < delay) {
        continue;
    }
}
```

## js实现instanceof

检测L的原型链（__proto__）上是否有R.prototype，若有返回true，否则返回false

```js
function myInstanceof(L, R) {
    var _R = R.prototype;
    var L = L.__proto__;
    while (L) {
        if (L === null) return false;
        if (L === _R) return true;
        L = L.__proto__;
    }
    return false
}
```

## forIn和forOf的区别

* forin遍历数组会遍历到数组原型上的属性和方法，更适合遍历对象
* forEach不支持break，continue，return等
* forof可以成功遍历数组的值，而不是索引，不会遍历原型
* forin可以遍历到obj的原型方法，如果不想遍历原型方法和属性的话，可以在循环内部判断一下，hasOwnProperty方法可以判断某属性是否是该对象的实例属性
