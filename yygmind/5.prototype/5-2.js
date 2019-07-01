// 图解原型链及其继承优缺点

// 图片5-2-1.jpeg

// 原型链的概念
// 每个对象拥有一个原型对象，通过__proto__指针指向上一个原型，并从中继承方法和属性，同时原型对象也可能拥有原型，这样一层一层，最终指向null，这种关系被称为原型链(prototype chain)。
// 原型上的方法和属性被继承到新对象中，并不是被复制到新对象。
function Foo(name) {
    this.name = name;
}
Foo.prototype.getName = function() {
    return this.name;
}
Foo.prototype.length = 3;
let foo = new Foo('muyiy');     // 相当于foo.__proto__ = Foo.prototype
console.dir(foo);
// 原型上的属性和方法定义在prototype对象上，而非对象实例本身。当访问一个对象的属性/方法时，它不仅仅在该对象上查找，还会查找该对象的原型，以及该对象的原型，以及该对象的原型的原型，一层一层向上查找，直到找到一个名字匹配的属性/方法或到达原型链的末尾(null)。

// 比如调用foo.valueOf()会发生什么？
// 首先检查foo对象是否具有可用的valueOf()方法
// 如果没有，则检查foo对象的原型对象(即Foo.prototype)是否具有可用的valueof()方法
// 如果没有，则检查Foo.prototype所指向的对象的原型对象(即Object.prototype)是否具有可用的valueOf()方法

// prototype和__proto__
// prototype并没有构建成一条原型链，其只是指向原型链中的某一处。原型链的构建依赖于__proto__

// instanceof原理及实现
// instanceof运算符用来检测constructor.prototype是否存在于参数object的原型链上
function C(){}
function D(){}
var o = new C();
o instanceof C;     // true     Object.getPrototypeOf(o) === C.prototype
o instanceof D;     // false    D.prototype不在o的原型链上
// instanceof原理就是一层一层查找__proto__，如果和constructor.prototype相等则返回true，如果一直没有查找成功则返回false
// instance.[__proto__...] === instance.constructor.prototype;

function instance_of(L, R) {        // L表示左表达式，R表示右表达式
    var O = R.prototype;            // 取R的显示原型
    L = L.__proto__;                // 取L的隐式原型
    while(true) {
        // Object.prototype.__proto__ === null
        if (L === null) {
            return false;
        }
        if (O === L) {              // 这里是重点，当O严格等于L，返回true
            return true;
        }
        L = L.__proto__;
    }
}
function C() {}
function D() {}
var o = new C();
instance_of(o, C);      // true
instance_of(o, D);      // false


// 原型链继承
// 原型链继承的本质是重写原型对象，代之以一个新类型的实例。
// 新原型Cat不仅有new Animal()实例上的全部属性和方法，并且由于指向了Animal原型，所以还继承了Animal原型上的属性和方法。
function Animal() {
    this.value = 'animal';
}
Animal.prototype.run = function() {
    return this.value + ' is running';
}
function Cat() {}
// 这里是关键。创建Animal的实例，并将该实例赋值给Cat.prototype
// 相当于Cat.prototype.__proto__ = Animal.prototype
Cat.prototype = new Animal();
var instance = new Cat();
instance.value = 'cat';             // 创建instance的自身属性value
console.log(instance.run());        // cat is running

// 原型链继承方案有以下缺点
// 多个实例对引用类型的操作会被篡改
// 子类型的原型上的constructor属性被重写了
// 给子类型原型添加属性和方法必须在替换原型之后
// 创建子类型实例时无法向父类型的构造函数传参

// 问题1
// 原型链继承方案中，原型实际上会变成另一个类型的实例，如下代码，Cat.prototype变成了Animal的一个实例，所以Animal的实例属性names就变成了Cat.prototype的属性
// 而原型属性上的引用类型值会被所有实例共享，所以多个实例对引用类型的操作会被篡改。如下代码，改变了instance1.names后影响了instance2
function Animal() {
    this.names = ['cat', 'dog']
}
function Cat() {}
Cat.prototype = new Animal();
var instance1 = new Cat();
instance1.names.push('tiger');
console.log(instance1.names);       // ['cat', 'dog', 'tiger']
var instance2 = new Cat();
console.log(instance2.names);       // ['cat', 'dog', 'tiger']

// 问题2
// 子类型原型上的constructor属性被重写了，执行Cat.prototype = new Animal()后原型被覆盖，Cat.prototype上丢失了constructor属性，Cat.prototype指向了Animal.prototype，而Animal.prototype.constructor指向了Animal，所以Cat.prototype.constructor指向了Animal
Cat.prototype = new Animal();
Cat.prototype.constructor === Animal;       // true
// 解决办法就是重写Cat.prototype.constructor属性，指向自己的构造函数Cat
function Animal() {
    this.value = 'animal';
}
Animal.prototype.run = function() {
    return this.value + ' is running';
}
function Cat() {}
Cat.prototype = new Animal();
// 新增，重写Cat.prototype的constructor属性，指向自己的构造函数Cat
Cat.prototype.constructor = Cat;

// 问题3
// 给子类型原型添加属性和方法必须在替换原型之后，因为子类型的原型会被覆盖。
function Animal() {
    this.value = 'animal';
}
Animal.prototype.run = function() {
    return this.value + ' is running';
}
function Cat() {}
Cat.prototype = new Animal();
Cat.prototype.constructor = Cat;
// 新增
Cat.prototype.getValue = function() {
    return this.value;
}
var instance = new Cat();
instance.value = 'cat';
console.log(instance.getValue());       // cat

// 属性遮蔽
// 改造上面的代码，在Cat.prototype上添加run方法，但是Animal.prototype上也有一个run方法，不过它不会被访问到，这种情况称为属性遮蔽(property shadowing)
function Animal() {
    this.value = 'animal';
}
Animal.prototype.run = function() {
    return this.value + ' is running';
}
function Cat() {}
Cat.prototype = new Animal();
Cat.prototype.constructor = Cat;
// 新增
Cat.prototype.run = function() {
    return 'cat cat cat';
}
var instance = new Cat();
instance.value = 'cat';
console.log(instance.run());        // run run run
// 如何访问被遮蔽的属性？通过__proto__调用原型链上的属性即可
console.log(instance.__proto__.__proto__.run());        // undefined is running

// 小结
// 每个对象拥有一个原型对象，通过__proto__指针指向上一个原型，并从中继承方法和属性，同时原型对象也可能拥有原型，这样一层一层，最终指向null，这种关系被称为原型链。
// 当访问一个对象的属性/方法时，它不仅仅在该对象上查找，还会查找该对象的原型，以及该对象的原型的原型，一层一层向上查找，直到找到一个名字匹配的属性/方法或到达原型链的末尾null。
// 原型链的构建依赖于__proto__，一层一层最终链接到null
// instanceof原理就是一层一层查找__proto__，如果和constructor.prototype相等则返回true，如果一直没有查找成功则返回false
// 原型链继承的本质是重写原型对象，代之以一个新类型的实例。


