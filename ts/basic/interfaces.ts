// 对象的类型——接口
// 在TypeScript中，我们使用接口Interface来定义对象的类型

// 在面向对象语言中，接口Interfaces是一个很重要的概念，它是对行为的抽象，而具体如何行动需要由类classes去实现implements。
// TypeScript中的接口是一个非常灵活的概念，除了可用于对类的一部分进行抽象以外，也常用于对对象的形状Shape进行描述。

interface Person {
    name: string;
    age: number;
}
let tom: Person = {
    name: 'Tom',
    age: 25
}
// 上面的例子中，我们定义了一个接口Person，接着定义了一个变量tom，它的类型是Person。这样，我们就约束了tom的形状必须和接口Person一致。
// 接口一般首字母大写。有的编程语言中会建议接口的名称加上I前缀。
// 定义的变量比接口少一些属性是不允许的：
interface Person {
    name: string;
    age: number;
}
let tom: Person = {
    name: 'Tom'
}                               // error
// 多属性也是不允许的
interface Person {
    name: string;
    age: number;
}
let tom: Person = {
    name: 'Tom',
    age: 25,
    gender: 'male'
}                               // error
// 可见，赋值的时候，变量的形状必须和接口的形状保持一致。

// 可选属性
// 有事我们希望不要完全匹配一个形状，那么可以用可选属性：
interface Person {
    name: string;
    age?: number;
}
let tom: Person = {
    name: 'Tom'
}
interface Person {
    name: string;
    age?: number;
}
let tom: Person = {
    name: 'Tom',
    age: 25
}
// 可选属性的含义是该属性可以不存在。这时仍然不允许添加未定义的属性：
interface Person {
    name: string;
    age?: number;
}
let tom: Person = {
    name: 'Tom',
    age: 25,
    gender: 'male'
}


// 任意属性
// 有时候我们希望一个接口允许有任意的属性，可以使用如下方式：
interface Person {
    name: string;
    age?: number;
    [propName: string]: any
}
let tom: Person = {
    name: 'Tom',
    gender: 'male'
}
// 使用[propName: string]定义了任意属性取string类型的值
// 需要注意的是，一旦定义了任意属性，那么确定属性和可选属性的乐行都必须是它的类型的子集：
interface Person {
    name: string;
    age?: number;
    [propName: string]: string;     // error
}
let tom: Person = {
    name: 'Tom',
    age: 25,
    gender: 'male'
}
// 任意属性的值允许时string，但是可选属性age的值是number，number不是string的子属性，所以报错了。


// 只读属性
// 我们希望对象中的一些字段只能在创建的时候被赋值，他们可以用readonly定义只读属性：
interface Person {
    readonly id: number;
    name: string;
    age?: number;
    [propName: string]: any;
}
let tom: Person = {
    id: 89757,
    name: 'Tom',
    gender: 'male'
}
tom.id = 9527;      // error
// 只读的约束存在于第一次给对象赋值的时候，而不是第一次给只读属性赋值的时候
interface Person {
    readonly id: number;
    name: string;
    age?: number;
    [propName: string]: any;
}
let tom: Person = {     // error id is missing
    name: 'Tom',
    gender: 'male'
};
tom.id = 89757;         // error




