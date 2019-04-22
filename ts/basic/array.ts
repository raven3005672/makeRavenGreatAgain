// 类型+方括号 表示法
let fibonacci: number[] = [1,1,2,3,5];
// 数组的项中不允许出现其他的类型：
let fibonacci: number[] = [1,'1',2,3,5];       // error
let fibonacci: number[] = [1,1,2,3,5];
fibonacci.push('8');        // error

// 数组泛型Array Generic
let fibonacci: Array<number> = [1,1,2,3,5];

// 用接口表示数组
interface NumberArray {
    [index: number]: number;
}
let fibonacci: NumberArray = [1,1,2,3,5];

// any在数组中的应用
// 一个比较常见的做法是，用any表示数组中允许出现任意类型：
let list: any[] = ['Xcat Liu', 25, {website: 'http://xcatliu.com'}];

// 类数组Array-like Object
// 类数组不是数组类型，比如arguments
function sum() {            // error
    let args: number[] = arguments;
}
// 事实上常见的类数组都有自己的接口定义，如IArguments, NodeList, HTMLCollection等
function sum() {
    let args: IArguments = arguments;
}