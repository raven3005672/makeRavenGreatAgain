// 构造函数
// 什么是构造函数
// constructor返回创建实例对象时构造函数的引用。此属性的值是对函数本身的引用，而不是一个包含函数名称的字符串。
function Parent(age) {
    this.age = age;
}
var p = new Parent(50);
p.constructor === Parent;   // true
p.constructor === Object;   // false
// 构造函数本身就是一个函数，与普通函数没有任何区别，不过为了规范一般将其首字母大写。构造函数和普通函数的区别在于，使用new生成实例的函数就是构造函数，直接调用的就是普通函数。
// 普通函数创建的实例不一定没有constructor属性
function parent2(age) {
    this.age = age;
}
var p2 = parent2(50);
function parent3(age) {
    return {
        age: age
    }
}
var p3 = parent3(50);
p3.constructor === Object;      // true

// Symbol是构造函数么？
// Symbol是基本数据类型，但作为构造函数来说他并不完整，因为它不支持语法new Symbol()
new Symbol(123);        // Symbol is not a constructor
Symbol(123);            // Symbol(123)
// 虽然是基本数据类型，但Symbol(123)实例可以获取constructor属性值
var sym = Symbol(123);
console.log(sym);               // Symbol(123)
console.log(sym.constructor);   // f Symbol() {[native code]}
// 这里的constructor是Symbol原型上的，即Symbol.prototype,constructor返回创建实例原型的函数，默认为Symbol函数

// consturctor
// 对于引用类型来说constructor属性值是可以修改的，但是对于基本类型来说是只读的。
// 引用类型情况其值可修改这个很好理解，比如原型链继承方案中，就需要对constructor重新赋值进行修正。
function Foo() {
    this.value = 42;
}
Foo.prototype = {
    method: function() {}
}
function Bar() {}
Bar.prototype = new Foo();
Bar.prototype.foo = 'hello world';
Bar.prototype.constructor === Object;       // true
Bar.prototype.constructor = Bar;
var test = new Bar();
console.log(test);                          // test.constructor => Bar()
// 对于基本类型来说是只读的，因为创建他们的是只读的原生构造函数（native constructors）

// 模拟实现new
function create() {
    // 创建一个空的对象
    var obj = new Object(),
    // 获得构造函数，同时删除arguments中第一个参数
    Con = [].shift.call(arguments);
    // 链接到原型，obj可以访问构造函数原型中的属性
    Object.setPrototypeOf(obj, Con.prototype);
    // 绑定this实现继承，obj可以访问到构造函数中的属性
    var ret = Con.apply(obj, arguments);
    // 优先返回构造函数返回的对象
    return ret instanceof Object ? ret : obj;
}

// 原型 prototype
// javascript是一种基于原型的语言
// 每个对象拥有一个原型对象，对象以其原型为模板，从原型继承方法和属性，这些属性和方法定义在对象的构造器函数的prototype属性上，而非对象实例本身。
// __proto__
// 原型上有__proto__属性，这是一个访问器属性(即getter函数和setter函数)，通过它可以访问到对象的内部[[Prototype]]（一个对象或null）
// [[Prototype]]是对象的一个内部属性，外部代码无法直接访问。
function Parent() {}
var p = new Parent();
p.__proto__ === Parent.prototype;       // true
// 图片5-1-1.jpeg

// 注意点
// __proto__数字能够在ES6时才被标准化，以确保Web浏览器的兼容性，但是不推荐使用，除了标准化的原因之外还有性能问题。为了更好地支持，推荐使用Object.getPrototypeOf()
// 如果要读取或修改对象的[[Prototype]]属性，建议使用如下方案，但是此时设置对象的[[Prototype]]依旧是一个缓慢的操作，如果性能是一个问题，就要避免这种操作。
// 获取
Object.getPrototypeOf()
Reflect.getPrototypeOf()
// 修改
Object.setPrototypeOf()
Reflect.setPrototypeOf()
// 如果要创建一个新对象，同时继承另一个对象的[[Prototype]]，推荐使用Object.create()
function Parent() {
    age: 50
};
var p = new Parent();
var child = Obejct.create(p);
// 这里child是一个新的空对象，有一个指向对象p的指针__proto__

// 优化实现new
function create() {
    // 获得构造函数，同时删除arguments中第一个参数
    Con = [].shift.call(arguments);
    // 创建一个空的对象并链接到原型，obj可以访问构造函数原型中的属性
    var obj = Object.create(Con.prototype);
    // 绑定this实现继承，obj可以访问到构造函数中的属性
    var ret = Con.apply(obj, arguments);
    // 优先返回构造函数返回的对象
    return ret instanceof Object ? ret : obj;
}


// 原型链
// 每个对象拥有一个原型对象，通过__proto__指针指向上一个原型，并从中继承方法和属性，同时原型对象也可能拥有原型，这样一层一层，最终指向null。这种关系被称为原型链（prototype chain），通过原型链一个对象会拥有定义在其他对象中的属性和方法。
function Parent(age) {
    this.age = age;
}
var p = new Parent(50);
p.constructor === Parent;       // true
// 这里p.constructor指向Parent，但是不意味着p实例存在constructor属性
// 实例对象p本身没有constructor属性，是通过原型链向上查找__proto__，最终查找到constructor属性，该属性指向Parent
p;          // Parent {age: 50}
p.__proto__ === Parent.prototype;       // true
p.__proto__.__proto__ === Object.prototype;     // true
p.__proto__.__proto__.__proto__ === null;       // true


// 小结
// Symbol作为构造函数来说并不完整，因为不支持语法new Symbol()，但其原型上拥有constructor属性，即Symbol.prototype.constructor
// 引用类型constructor属性值是可以修改的，但是对于基本类型来说是只读的，当然null和undefined没有constructor属性
// __proto__是每个实例上都有的属性，prototype是构造函数的属性，这两个并不一样，但p.__proto__和Parent.prototype指向同一个对象。
// __proto__属性在ES6时被标准化，但因为性能问题并不推荐使用，推荐使用Object.getPrototypeOf()
// 每个对象拥有一个原型对象，通过__proto__指针指向上一个原型，并从中继承方法和属性，同时原型对象也可能拥有原型，这样一层一层，最终指向null，这就是原型链。



