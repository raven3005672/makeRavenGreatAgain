// 联合类型（Union Types）表示取值可以为多种类型中的一种。

let myFavoriteNumber: string | number;
myFavoriteNumber = 'seven';
myFavoriteNumber = 7;

let myFavoriteNumber: string | number;
myFavoriteNumber = true;                // error

// 联合类型使用 | 分割每个类型
// 允许myFavoriteNumber的类型是string或者number，但是不能是其他类型

// 访问联合类型的属性或方法
// 当TypeScript不确定一个联合类型的变量到底是哪个类型的时候，我们只能访问此联合类型的所有类型里共有的属性或方法：
function getLength(something: string | number): number {
    return something.length;
    // error length does not exist on type 'string | number'
    // property length does not exist on type 'number'
}
// 上例中length不是string和number的共有属性，所以会报错
// 访问string和number的共有属性是没问题的
function getString(something: string | number): string {
    return something.toString();
}

// 联合类型的变量在被赋值的时候，会根据类型推论的规则推断出一个类型：
let myFavoriteNumber:string | number;
myFavoriteNumber = 'seven';                 // type推断为string
console.log(myFavoriteNumber.length);       // 5
myFavoriteNumber = 7;                       // type推断为number
console.log(myFavoriteNumber.length);       // error    length does not exist on type 'number'



