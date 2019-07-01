// Function&Object问题

Object.prototype
// Object.prototype表示Object的原型对象，其[[Prototype]]属性是null，访问器属性__proto__暴露了一个对象的内部[[Prototype]]
// Object.prototype并不是通过Object函数创建的。
function Foo() {
    this.value = 'foo';
}
let f = new Foo();
f.__proto__ === Foo.prototype;      // true
// 实例对象的__proto__指向构造函数的prototype，即f.__proto__指向Foo.prototype，但是Object.prototype.__proto__是nunll，所以Object.prototype并不是通过Object函数创建的，那它如何生成的？其实Object.prototype是浏览器底层根据ECMAScript规范创造的一个对象。
// Object.prototype就是原型链的顶端(不考虑null的情况下)，所有对象继承了它的toString等方法和属性。

Function.prototype
// Function.prototype对象是一个函数(对象)，其[[Prototype]]内部属性值指向内建对象Object.prototype。Function.prototype对象自身没有valueOf属性，其从Object.prototype对象继承了valueOf属性。
// Function.prototype的[[Class]]属性是Function，所以这是一个函数，但又不大一样，这个函数没有prototype属性。
Function.prototype      // f () {[native code]}
Function.prototype.prototype    // undefined
let fun = Function.prototype.bind();        // f () {[native code]}
fun.prototype                   // undefined

function Object
// Object作为构造函数时，其[[Prototype]]内部属性值指向Function.prototype，即
Object.__proto__ === Function.prototype;            // true
// 使用new Object()创建新对象时，这个新对象的[[Prototype]]内部属性指向构造函数的prototype属性，即Object.prototype
// 当然也可以通过对象字面量等方式创建对象
// 使用对象字面量创建的对象，其[[Prototype]]值是Object.prototype
// 使用数组字面量创建的对象，其[[Prototype]]值是Array.prototype
// 使用function f() {}函数创建的对象，其[[Prototype]]值是Function.prototype
// 使用new fun()创建的对象，其中fun是由javascript提供的内建构造器函数之一(Object, Function, Array, Boolean, Date, Number, String等等)，其[[Prototype]]值是fun.prototype
// 使用其他javascript构造器函数创建的对象，其[[Prototype]]值就是该构造器函数的prototype属性

let o = {a: 1};                 // 原型链: o => Object.prototype => null
let a = ['yo', 'whadup', '?'];  // 原型链: a => Array.prototype => null
function f() {
    return 2;                   // 原型链: f => Function.prototype => Object.prototype => null
}
let fun = new Function();       // 原型链: fun => Function.prototype => Object.prototype => null
function Foo() {}
let foo = new Foo();            // 原型链: foo => Foo.prototype => Object.prototype => null
function Foo() {
    return {};
}
let foo = new Foo();            // 原型链： foo => Object.prototype => null

function Function
// Function构造函数是一个函数对象，其[[Class]]属性是Function。Function的[[Prototype]]属性指向了Function.prototype，即
Function.__proto__ === Function.prototype           // true


// Function & Object 问题
Object instanceof Function      // true
Function instanceof Object      // true
Object instanceof Object        // true
Function instanceof Function    // true
// Object构造函数继承了Function.prototype，同时Function构造函数继承了Object.prototype。这里就产生了鸡和蛋的问题。
// Function.prototype和Function.__proto__都指向Function.prototype。
Object.__proto__ === Function.prototype             // true     Object instanceof Function
Function.__proto__.__proto__ === Object.prototype   // true     Function instanceof Object
Object.__proto__.__proto__ === Object.prototype     // true     Object instanceof Object
Function.__proto__ === Function.prototype           // true     Function instanceof Function


// 内置类型构建过程
// JavaScript内置类型是浏览器内核自带的，浏览器底层对JavaScript的实现基于C/C++，那么浏览器在初始化JavaScript环境时发生了什么？
// 1、用C/C++构造内部数据结构创建一个OP即（Object.prototype）以及初始化其内部属性但不包括行为。
// 2、用C/C++构造内部数据结构创建一个FP即（Function.prototype）以及初始化其内部属性但不包括行为。
// 3、将FP的[[Prototype]]指向OP
// 4、用C/C++构造内部数据结构创建各种内置引用类型
// 5、将各内置引用类型的[[Prototype]]指向FP
// 6、将Function的prototype指向FP
// 7、将Object的prototype指向OP
// 8、用Function实例化出OP、FP，以及Object的行为并挂载
// 9、用Object实例化出除Object以及Function的其他内置引用类型的prototype属性对象
// 10、用Function实例化出除Object以及Function的其他内置引用类型的prototype属性对象的行为并挂载
// 11、实例化内置对象Math以及Global
// 至此，所有内置类型构建完成。





