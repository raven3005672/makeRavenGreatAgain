# 总结TypeScript在项目开发中的应用实践体会

readonly

条件类型

```ts
type B<T> = T extends string ? '1' : '2'
const a: B<string> = '1'
const b: B<number> = '1'  // err
```

namespace

```ts
declare namespace JSONValue {
  type a = number
}
const age: JSONValue.a = '2'  // err
```

declare

```ts
declare var/let/const // 声明全局的变量
declare function  // 声明全局方法
declare class // 声明全局类
declare namespace // 声明命名空间
declare module // 声明模块
// 在模块文件中定义declare，如果想要用作全局就可以使用declare global完成该需求。
```

模块类型

```ts
declare const config: BaseConfig & EnvConfig
export = config
```

模板字符串类型

```ts
declare type HTTP = `http://${string}`
declare type HTTPS = `https://${string}`
type baseApi = HTTP | HTTPS
```

函数重载

```ts
function getInfo(name: string): void;
function getInfo(age: number): void;
function getInfo(params: any): void {
  if (typeof params == 'string') {
    console.log(params);
  }
  if (typeof params == 'number') {
    console.log(params);
  }
}
```

getter/setter

枚举 enum

泛型

```ts
// 简单的泛型
type Generics<T> = {
    name: string
    age: number
    sex: T
}
interface Generics<T> {
    name: string
    age: number
    sex: T
}
// 简单的函数泛型
function setSex<T> (sex: T) {
}

setSex<'男'>('女')
// 泛型类
class Person<T> {
    private sex: T;
    constructor(readonly type: T) { 
        this.sex = type; 
    }
}

const person = new Person<'男'>('女')
```

工具类型

只读对象 readonly

Record 快速创建对象类型 Record<K, V>

```ts
const person: Record<string, string> = {
  name: 'xxx',
  age: 22,  // err
}
```

Pick 从一组属性中拿出某个属性，并将其返回

```ts
interface Person {
  name: string;
  age: number;
}
type age = Pick<Person, 'age'> // { age: number }
```

Omit 从一组属性中排除某个属性，并将排除属性后的结果返回

```ts
interface Person {
  name: string;
  age: number;
}
type age = Omit<Person, 'age'>  // { name: string }
```

Exclude 从一个联合类型中排除掉属于另一个联合类型的子集

```ts
interface A {
    show: boolean,
    hidden: boolean,
    status: string
}

interface B {
    show: boolean,
    name: string
}

type outPut = Exclude<keyof A, keyof B>

type outPut = Exclude<1|2|3|4, 2|3> // 1 | 4
```

Extract 从一个联合类型中无处属于另一个联合类型的子集

```ts
interface A {
    show: boolean,
    hidden: boolean,
    status: string
}

interface B {
    show: boolean,
    name: string
}

type outPut = Exclude<keyof A, keyof B> // show
```

Partial 将类型转为可选类型的工具，对于不明确的类型来说，需要将所有的属性转化为可选的?.形式，转换成为可选的属性类型。

```ts
interface Person {
  name: string
}
const a: Partial<Person> = {}
```






