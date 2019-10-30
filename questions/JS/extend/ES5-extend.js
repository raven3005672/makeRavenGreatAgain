// ES5继承
// 构造函数、原型和实例的关系：每一个构造函数都有一个原型对象，每一个原型对象都有一个指向构造函数的指针，每一个实例都包含一个指向原型对象的内部指针。


// 原型链实现继承
// 基本思想：利用原型让一个引用类型继承另一个引用类型的属性和方法，即让原型对象等于另一个类型的实例。
// Code
function SuperType() {
    this.property = true;
}
SuperType.prototype.getSuperValue = function() {
    return this.property;
}
function SubType() {
    this.subProperty = false;
}
// 继承
SubType.prototype = new SuperType();
SubType.prototype.getSubValue = function() {
    return this.subProperty;
}
var instance = new SubType();
console.log(instance.getSuperValue());  // true
console.log(instance.getSubValue());    // false
// 缺点
// 包含引用类型值的原型，会被所有实例共享。
// 创造子类型的实例时，不能向超类型的构造函数中传递参数。



// 构造函数继承
// 基本思想：在子类型构造函数的内部调用超类型构造函数，通过使用apply和call方法可以在将来新创建で对象上执行构造函数。
// Code
function SuperType() {
    this.colors = ['red', 'blue', 'green'];
}
function SubType() {
    SuperType.call(this);
}
var instance1 = new SubType();
instance1.colors.push('black');
console.log(instance1.colors.length) // 4
var instance2 = new SubType();
console.log(instance2.colors.length) // 3
// 缺点
// 方法都在构造函数中定义，函数无法复用
// 在超类型中定义的方法，子类型不可见，结果所有类型都只能使用构造函数模式



// 组合继承
// 基本思想：将原型链和构造函数组合到一起，使用原型链实现对原型属性和方法的继承，用构造函数实现对实例属性的继承。
// Code
function SuperType(name) {
    this.name = name;
    this.colors = ['red', 'green', 'blue'];
}
SuperType.prototype.sayName = function() {
    console.log(this.name);
}
function SubType(name, age) {
    // 继承属性
    SuperType.call(this, name);
    this.age = age;
}
// 继承方法
SubType.prototype = new SuperType();
SubType.prototype.constructor = SubType;
SubType.prototype.sayAge = function() {
    console.log(this.age);
}
var instance1 = new SubType('Annika', 21);
instance1.colors.push('black');
console.log(instance1.colors.length);       // 4
instance1.sayName();                        // Annika
instance1.sayAge();                         // 21
var instance2 = new SubType('Anna', 22);
console.log(instance2.colors.length);       // 3
instance2.sayName();                        // Anna
instance2.sayAge();                         // 22
// 缺点
// 无论在什么情况下，都会调用两次超类型的构造函数，一次是在创建子类原型的时候，一次是在子类型构造函数的内部。



// 原型式继承
// 基本思想：不用严格意义上的构造函数，借助原型可以根据已有的对象创建新对象，还不必因此创建自定义类型。
// Code
// 本质上讲，object对传入其中的对象执行了一次浅复制
function object(o) {
    function F() {}
    F.prototype = o;
    return new F();
}
var person = {
    name: 'Annika',
    friends: ['Alice', 'Joyce']
}
var anotherPerson = object(person);
anotherPerson.name = 'Greg';
anotherPerson.friends.push('Rob');
var yetAnotherPerson = object(person);
yetAnotherPerson.name = 'Linda';
yetAnotherPerson.friends.push('Sophia');
console.log(person.friends);    // [1,2,3,4]
// ES5新增Object.create方法，规范了原型式继承，接收两个参数，一个用作新对象原型的对象和（可选的）一个为新对象定义额外属性的对象。
var anotherPerson = Object.create(person, {
    name: {
        value: "Greg"
    }
});
console.log(anotherPerson.name);
console.log(person.name)
// 缺点
// 创造两个相似的对象，但是包含引用类型的值的属性始终会共享响应的值



// 寄生继承
// 基本思想：寄生继承创造一个仅用于封装继承过程的函数，在函数内部以某种方式增强对象，最后再返回对象。
// Code
function createAnother(original) {
    // 通过调用函数创建一个新对象
    var clone = object(original);
    // 增强对象
    clone.sayHi = function() {
        console.log('Hi');
    }
    // 返回对象
    return clone;
}
// 缺点
// 使用寄生继承来为对象添加函数，会因为做不到函数复用而降低效率，这个与构造函数模式类似。



// 寄生组合
// 基本思想：通过构造函数来继承属性，通过原型链的混合形式来继承方法，不必为了指定子类型的原型而调用超类型的构造函数，只需要超类型的一个副本。本质上，就是使用寄生继承来继承超类型的原型，然后再将结果指定给子类型的原型。
// Code
function inheritPrototype(subType, superType) {
    function F() {
        this.constructor = subType;
    }
    F.prototype = superType.prototype;
    subType.prototype = new F();
}
function SuperType(name) {
    this.name = name;
    this.colors = ['red', 'green', 'blue'];
}
SuperType.prototype.sayName = function() {
    console.log(this.name);
}
function SubType(name, age) {
    // 继承属性
    SuperType.call(this, name);
    this.age = age;
}
// 继承方法
inheritPrototype(SubType, SuperType);
SubType.prototype.sayAge = function() {
    console.log(this.age);
}
var instance1 = new SubType('Nicholas', 29);
instance1.colors.push('black');
console.log(instance1.colors.length);       // 4
instance1.sayName();                        // 'Nicholas'
instance1.sayAge();                         // 29
var instance2 = new SubType("Greg", 27);
console.log(instance2.colors.length);       // 3
instance2.sayName();                        // 'Greg'
instance2.sayAge();                         // 27
// 只调用了一次superType构造函数，因此避免在subType.prototype上创建不必要的，多余的属性，与此同时，原型链还能保持不变，还能正常使用instancof和isPrototypeOf()，寄生组合继承被认为是引用类型最理想的继承方式。


