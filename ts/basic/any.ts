// 任意值(Any)用来表示允许赋值为任意类型。
// 如果是一个普通类型，在赋值过程中改变类型是不被允许的：
let myFavoriteNumber: string = 'seven';
myFavoriteNumber = 7;           // error
// 但如果是any类型，则允许被赋值为任意类型。
let myFavoriteNumber: any = 'seven';
myFavoriteNumber = 7;           // suc


// 任意值的属性和方法
// 在任意值上访问任何属性都是允许的：
let anyThing: any = 'hello';
console.log(anyThing.myName);
console.log(anyThing.myName.firstName);
// 也允许调用任何方法：
let anyThing: any = 'Tom';
anyThing.setName('Jerry');
anyThing.setName('Jerry').sayHello();
anyThing.myName.setFirstName('Cat');
// 可以认为，声明一个变量未任意值之后，对它的任何操作，返回的内容的类型都是任意值。


// 未声明类型的变量
// 变量如果在声明的时候，未指定其类型，那么它会被识别为任意值类型：
let something;
something = 'seven';
something = 7;
something.setName('Tom');
// 等价于
let something: any;
something = 'seven';
something = 7;
something.setName('Tom');
