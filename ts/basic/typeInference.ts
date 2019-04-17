// 类型推论
// 如果没有明确的指定类型，那么TypeScript会依照类型推论(Type Inference)的规则推断出一个类型。

// 以下代码虽然没有指定类型，但是会在编译的时候报错：
let myFavoriteNumber = 'seven';
myFavoriteNumber = 7;       // error
// 事实上，它等价于：
let myFavoriteNumber: string = 'seven';
myFavoriteNumber = 7;       // error
// TypeScript会在没有明确的指定类型的时候推测一个类型，这就是类型推论。

// 如果定义的时候没有赋值，不管之后有没有复制，都会被推断成any类型而完全不被类型检查。
let myFavoriteNumber;
myFavoriteNumber = 'seven';
myFavoriteNumber = 7;

