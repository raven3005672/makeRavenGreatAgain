class Colorpoint extends Point {
    constructor(x, y, color) {
        super(x, y);        // 调用父类的constructor(x, y)
        this.color = color;
    }
    toString() {
        return this.color + ' ' + super.toString();
    }
}

// 子类必须在constructor方法中调用super方法，否则新建实例时会报错。
// 这是因为子类没有自己的this对象，而是继承父类的this对象，然后对其进行加工，如果不调用super方法，子类就得不到this对象。
// 因此，只有调用super之后，才可以使用this关键字。

// 一个继承语句同时存在两条继承链：一条实现属性继承，一条实现方法继承
class A extends B {}
A.__proto__ === B;                          // 继承属性
A.prototype.__proto__ === B.prototype;      // 继承方法