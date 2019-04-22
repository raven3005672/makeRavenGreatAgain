// 函数声明
// 在javascript中有两种常见的定义函数的方式——函数声明Function Declaration和函数表达式Function Expression
function sum(x, y) {
    return x + y;
}
let mySum = function(x, y) {
    return x + y;
}
// 一个函数有输入和输出，要在TypeScript中对齐进行约束，需要把输入和输出都考虑到，其中函数声明的类型定义比较简单：
function sum(x: number, y: number): number {
    return x + y;
}
// 注意：输入多余的（或者少于要求的）参数，是不被允许的。
function sum(x: number, y: number): number {
    return x + y;
}
sum(1, 2, 3);           // error
sum(1);                 // error


// 函数表达式
let mySum = function(x: number, y: number): number {
    return x + y;
}
// 这是可以通过编译的，不过事实上，上面的代码只对等号右侧的匿名函数进行了类型定义，而等号左边的mySum，是通过赋值操作进行类型推论而推断出来的。
// 如果需要我们手动给mySum添加类型，则应该是这样：
let mySum: (x: number, y: number) => number = function(x: number, y: number): number {
    return x + y;
};
// 注意不要混淆了TypeScript中的=>和ES6中的=>
// 在TypeScript的类型定义中，=>用来表示函数的定义，左边是输入类型，需要用括号括起来，右边是输出类型。


// 用接口定义函数的形状
// 我们也可以使用接口的方式来定义一个函数需要符合的形状：
interface SearchFunc {
    (source: string, subString: string): boolean;
}
let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
    return source.search(subString) !== -1;
}


// 可选参数
// 与接口中的可选属性类似，我们用?表示可选的参数：
function buildName(firstName: string, lastName?: string) {
    if (lastName) {
        return firstName + ' ' + lastName;
    } else {
        return firstName;
    }
}
let tomcat = buildName('Tom', 'Cat');
let tom = buildName('Tom');
// 需要注意的是，可选参数必须接在必须参数后面。换句话说，可选参数后面不允许再出现必须参数了：
function buildName(firstName?: string, lastName: string) {              // error
    if (firstName) {
        return firstName + ' ' + lastName;
    } else {
        return lastName;
    }
}
let tomcat = buildName('Tom', 'Cat');
let tom = buildName(undefined, 'Tom');


// 参数默认值
// 在ES6中，我们允许给函数的参数添加默认值，TypeScript会将添加了默认值的参数识别为可选参数:
function buildName(firstName: string, lastName: string = 'Cat') {
    return firstName + ' ' + lastName;
}
let tomcat = buildName('Tom', 'Cat');
let tom = buildName('Tom');
// 此时就不受【可选参数必须接在必须参数后面】的限制了：
function buildName(firstName: string = 'Tom', lastName: string) {
    return firstName + ' ' + lastName;
}
let tomcat = buildName('Tom', 'Cat');
let cat = buildName(undefined, 'Cat');


// 剩余参数
// 在ES6中，可以使用...rest的方式获取函数中的剩余参数(rest参数)：
function push(array, ...items) {
    items.forEach(function(item) {
        array.push(item);
    });
}
let a = [];
push(a, 1,2,3);
// 事实上，items是一个数组，所以我们可以用数组的类型来定义它：
function push(array: any[], ...items: any[]) {
    items.forEach(function(item) {
        array.push(item);
    });
}
let a = [];
push(a, 1,2,3);
// rest参数只能是最后一个参数。


// 重载
// 重载允许一个函数接受不同数量或类型的参数时，做出不同的处理。
// 利用联合类型，我们可以这么实现：
function reverse(x: number|string): number|string {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
// 然而这样有一个缺点，就是不能够精确的表达，输入为数字的时候，输出也应该为数字，输入为字符串的时候，输出也应该为字符串。
// 这时，我们可以使用重载定义多个 reverse 的函数类型：
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
// 上例中，我们重复定义了多次函数 reverse，前几次都是函数定义，最后一次是函数实现。在编辑器的代码提示中，可以正确的看到前两个提示。

// 注意，TypeScript 会优先从最前面的函数定义开始匹配，所以多个函数定义如果有包含关系，需要优先把精确的定义写在前面。
