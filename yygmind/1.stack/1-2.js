// 执行上下文栈和变量对象

// 例子1：变量提升
foo;        // undefined
var foo = function () {
    console.log('foo1');
}
foo();      // foo1, foo赋值
var foo = function () {
    console.lof('foo2');
}
foo();      // foo2, foo重新赋值

// 例子2：函数提升
foo();      // foo2
function foo() {
    console.log('foo1');
}
foo();      // foo2
function foo() {
    console.log('foo2');
}
foo();      // foo2

// 例子3：声明优先级，函数 > 变量
// 同一作用域下存在多个同名函数声明，后面的会替换前面的函数声明
foo();      // foo2
var foo = function() {
    console.log('foo1');
}
foo();      // foo1, foo重新赋值
function foo() {
    console.log('foo2');
}
foo();      // foo1


// 执行上下文
// 执行上下文总共有三种类型：全局执行上下文，函数执行上下文，Eval函数执行上下文

ECStack = [             // 使用数组模拟栈
    globalContext
];

// 以下两段代码执行的结果是一样的，但是两端代码的执行上下文栈的变化时不一样的。
var scope = "global scope";
function checkscope() {
    var scope = "local scope";
    function f() {
        return scope;
    }
    return f();
}
checkscope();
// 栈变化
// ECStack.push(<checkscope> functionContext);
// ECStack.push(<f> functionContext);
// ECStack.pop();
// ECStack.pop();

var scope = "global scope";
function checkscope() {
    var scope = "local scope";
    function f() {
        return scope;
    }
    return f;
}
checkscope()();
// 栈变化
// ECStack.push(<checkscope> functionContext);
// ECStack.pop();
// ECStack.push(<f> functionContext);
// ECStack.pop();

// 函数上下文
// 在函数上下文中，用活动对象（activation object, AO）来表示变量对象。
// 活动对象和变量对象的区分在于
// 1.变量对象(VO)是规范上或者是JS引擎上实现的，并不能在JS环境中直接访问。
// 2.当进入到一个执行上下文后，这个变量对象才会被激活，所以叫活动对象（AO），这时候活动对象上的各种属性才能被访问。
// 调用函数时，会为其创建一个Arguments对象，并自动初始化局部变量arguments，指代该Arguments对象。所有作为参数传入的值都会成为Arguments对象的数组元素。

// 执行过程
// 执行上下文的代码会分成两个阶段进行处理：1.进入执行上下文；2.代码执行

// 进入执行上下文
// 此时的变量对象会包括（如下顺序初始化）：
// 1.函数的所有形参（only函数上下文）：没有实参，属性值设为undefined。
// 2.函数声明：如果变量对象已经存在相同名称的属性，则完全替换这个属性。
// 3.变量声明：如果变量名称跟已经声明的形参或函数相同，则变量声明不会干扰已经存在的这类属性。

function foo(a) {
    var b = 2;
    function c() {}
    var d = function() {};
    b = 3;
}
foo(1);
// 对应活动对象AO如下
AO = {
    arguments: {
        0: 1,
        length: 1
    },
    a: 1,
    b: undefined,
    c: reference to functioin c() {},
    d: undefined
}
// 形参arguments这时候已经有赋值了，但是变量还是undefined，只是初始化的值

// 代码执行
// 这个阶段会顺序执行代码，修改变量对象的值，执行完成后AO如下
AO = {
    arguments: {
        0: 1,
        length: 1
    },
    a: 1,
    b: 3,
    c: reference to function c() {},
    d: reference to FunctionExpression "d"
}

// 总结
// 1.全局上下文的变量对象初始化是全局对象
// 2.函数上下文的变量对象初始化只包括Arguments对象
// 3.在进入执行上下文时会给变量对象添加形参、函数声明、变量声明等初始的属性值
// 4.在代码执行阶段，会再次修改变量对象的属性值