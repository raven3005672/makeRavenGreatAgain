# ts题目

## void和undefined有什么区别？

## 什么是never类型

## 下面代码会不会报错？怎么解决？

```js
const obj = {
    a: 1,
    b: 'string',
};
obj.c = null;
```

## readonly和const有什么区别

## 下面代码中，foo的类型应该如何声明

```js
function foo(a: number) {
    return a + 1;
}
foo.bar = 123;
```

## 下面代码中，foo的类型如何声明

```js
let foo = {};
for (let i = 0; i < 100; i++) {
    foo[String(i)] = i;
}
```

## 实现MyInterface

```js
interface MyInterface {
    // ...
}
class Bar implements MyInterface {
    constructor(public name: string) {}
}
class Foo implements MyInterface {
    constructor(public name: string) {}
}
function myfn(Klass: MyInterface, name: string) {
    return new Klass(name);
}
myfn(Bar);
myfn(Foo);
```

## 什么是Abstract Class

## 什么是class mixin，如何实现

## typeof关键词有什么用

## keyof关键词有什么用

## 下面代码中，foo的类型如何声明

```js
function fn(value: number): string {
    return String(value);
}
const foo = fn;
```

## 下面代码会导致ts编译失败，如何修改getValue的类型声明

```js
function getValue() {
    return this.value;
}
getValue();
```

## 下面是vue-class-component的部分代码，解释为什么会有多个Component函数的声明，作用是什么？ts官方文档的那一节有对应的解释文档？

```js
function Component<U extends Vue>(options: ComponentOptions<U>): <V extends VueClass>
function Component<V extends VueClass>(target: V): V
function Component<V extends VueClass, U extends Vue> (
    options: ComponentOptions<U> | V
): any {
    if (typeof options === 'function') {
        return componentFactory(options)
    }
    return function(Component:V) {
        return componentFactory(Component, options)
    }
}
```

## 如何声明foo的类型

```js
const foo = new Map();
foo.set('bar', 1);
```

## 如何声明getProperty，以便能检查出第八行将会出现的运行错误

```js
function getProperty(obj, key) {
    return obj[key].toString();
}

let x = {a: 1, b: 2, c: 3, d: 4};

getProperty(x, 'a');
getProperty(x, 'm');
```

## 类型声明里 & 和 | 有什么作用

## 下面代码里data is Date有什么作用

```js
function isDate(data: any): date is Date {
    if (!date) return false;
    return Object.prototype.toString.call(date) === '[object Date]';
}
```

## tsconfig.json里 --strictNullChecks参数的作用是什么

## interface和type声明有什么区别

## 如何完善Calculator的声明

```js
interface Calculator {
    //...
}
let calcu: Calculator;
calcu(2).multiply(5).add(1)
```

## import ... from / import ... = require() / import(path: string) 有什么区别

## declare关键字有什么用

## module关键字有什么用

## 如何处理才能在ts中引用css或者图片使之不报错

```js
import './index.scss';
import imgPath from './home.png';
```

## 编写d.ts来声明下面的js文件

```js
class Foo {

}
module.exports = Foo;
module.exports.Bar = 1;
```

## namespace和module有什么区别

## 如何实现module alias？编译成js能否直接运行

```js
import Bar from '@src/Bar';
```

## 哪些声明既可以当做type也可以当做value？
