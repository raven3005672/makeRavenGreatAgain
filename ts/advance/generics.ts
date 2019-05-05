// 泛型
// 泛型Generics是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。

// 简单的例子
// 首先，我们来实现一个函数createArray，它可以创建一个指定长度的数组，同时将每一项都填充一个默认值：
function createArray(length: number, value: any): Array<any> {
    let result = [];
    for (let i = 0;i < length; i++) {
        result[i] = value;
    }
    return result;
}
createArray(3, 'x');            // ['x', 'x', 'x']
// 上例中，我们使用了之前提到过的数组泛型来定义返回值的类型。
// 这段代码编译不会报错，但是一个显而易见的缺陷是，它并没有准确的定义返回值的类型：
// Array<any>允许数组的每一项都任意类型。但是我们预期的是，数组中每一项都应该是输入的value的类型。
// 这时候，泛型就派上用场了：
function createArray<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}
createArray(3, 'x');        // ['x', 'x', 'x']

// 多个类型参数
// 定义泛型的时候，可以一次定义多个类型参数：
function swap<T, U>(tuple: [T, U]): [U, T] {
    return [tuple[1], tuple[0]];
}
swap([7, 'seven']);         // ['seven', 7]
// 上例中，我们定义了一个swap函数，用来交换输入的元组

// 泛型约束
// 在函数内部使用泛型变量的时候，由于事先不知道它是哪种类型，所以不能随意的操作它的属性或方法：
function loggingIdentity<T>(arg: T): T {
    console.log(arg.length);                    // err
    return arg;
}
// 上例中，泛型T不一定包含属性length，所以编译的时候报错了。
// 这时，我们可以对泛型进行约束，只允许这个函数传入那些包含length属性的变量。这就是泛型约束：
interface Lengthwise {
    length: number;
}
function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);
    return arg;
}
// 上例中，我们使用了extends约束了泛型T必须符合接口Lengthwise的形状，也就是必须包含length属性。
// 此时如果调用loggingIdentity的时候，传入的arg不包含length，那么在编译阶段就会报错了：
interface Lengthwise {
    length: number;
}
function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);
    return arg;
}
loggingIdentity(7);                     // error
// 多个类型参数之间也可以相互约束：
function copyFields<T extends U, U>(target: T, source: U): T {
    for(let id in source) {
        target[id] = (<T>source)[id];
    }
    return target;
}
let x = {a: 1, b: 2, c: 3, d: 4};
copyFields(x, {b: 10, d: 20});
// 上例中，我们使用了两个类型参数，其中要求T继承U，这样就就保证了U上不会出现T中不存在的字段。

// 泛型接口
// 可以使用接口的方式来定义一个函数需要符合的形状：
interface SearchFunc {
    (source: string, subString: string): boolean;
}
let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
    return source.search(subString) !== -1;
}
// 当然也可以使用含有泛型的接口来定义函数的形状：
interface CreateArrayFunc {
    <T>(length: number, value: T): Array<T>;
}
let createArray: CreateArrayFunc;
createArray = function<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}
createArray(3, 'x');        // ['x', 'x', 'x']
// 进一步，我们可以把泛型参数提前到接口名上：
interface CreateArrayFunc<T> {
    (length: number, value: T): Array<T>;
}
let createArray: CreateArrayFunc<any>;
createArray = function<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}
createArray(3, 'x');            // ['x', 'x', 'x']
// 注意，此时在使用泛型接口的时候，需要定义泛型的类型。

// 泛型类
// 与泛型接口类似，泛型也可以用于类的类型定义中：
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}
let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };

// 泛型参数的默认类型
// 在 TypeScript 2.3 以后，我们可以为泛型中的类型参数指定默认类型。当使用泛型时没有在代码中直接指定类型参数，从实际值参数中也无法推测出时，这个默认类型就会起作用。
function createArray<T = string>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

