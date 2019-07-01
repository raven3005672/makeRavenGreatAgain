// new原理及模拟实现
// new运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例。

// 例子
function Car(color) {
    this.color = color;
}
Car.prototype.start = function() {
    console.log(this.color + ' car start');
}
var car = new Car('black');
car.color;      // 访问构造函数里的属性 
// black
car.start();    // 访问原型里的属性
// balck car start

// new创建的实例有以下两个特性
// 1.访问到构造函数里的属性
// 2.访问到原型里的属性
// 注意
// ES6新增Symbol类型，不可以使用new Symbol()，因为symbol是基本数据类型，每个从Symbol()返回的symbol值都是唯一的。

// 模拟实现
// 当代码new Foo(...)执行时，会发生以下事情：
// 一个继承自Foo.prototype的新对象被创建。
// 使用指定的参数调用构造函数Foo，并将this绑定到新创建的对象。new Foo等同于new Foo()，也就是没有指定参数列表，Foo不带任何参数调用的情况。
// 由构造函数返回的对象就是new表达式的结果。如果构造函数没有显式返回一个对象，则使用步骤1创建的对象。
// 模拟实现第一步
function create() {
    // 创建一个空的对象
    var obj = new Object(),
    // 获得构造函数，arguments中去除第一个参数
    Con = [].shift.call(arguments);
    // 链接到原型，obj可以访问到构造函数原型中的属性
    obj.__proto__ = Con.prototype;
    // 绑定this实现继承，obj可以访问到构造函数中的属性
    Con.apply(obj, arguments);
    // 返回对象
    return obj;
}
// 测试
function Car(color) {
    this.color = color;
}
Car.prototype.start = function() {
    console.log(this.color + ' cat start');
}
var car = create(Car, 'black');
car.color;      // black
car.start();    // black car start
// 模拟实现第二步
function create() {
    // 创建一个空的对象
    var obj = new Object(),
    // 获得构造函数，arguments中去除第一个参数
    Con = [].shift.call(arguments);
    // 链接到原型，obj可以访问到构造函数原型中的属性
    obj.__proto__ = Con.prototype;
    // 绑定this实现继承，obj可以访问到构造函数中的属性
    var ret = Con.apply(obj, arguments);
    // 优先返回构造函数返回的对象
    return ret instanceof Object ? ret : obj;
}
