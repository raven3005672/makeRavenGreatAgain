# TS

## 何时检查类型

在编译时就会检查类型。

## void

void代表无效的，一般只用在函数上，表示这个函数没有返回值。

## never

一个永远不会有值的类型，或者说是一个永远也执行不完的类型。undefined、null也算是有值。

如果一个函数执行时抛出了**异常**，那么这个函数永远不存在返回值（因为抛出异常会直接中断程序运行，这使得程序运行不到返回值那一步，即具有不可达的终点，也就永不存在返回了）；
函数中执行无限循环的代码**死循环**，使得程序永远无法运行到函数返回值那一步，永不存在返回。


## 实用类型

- Exclude: 从一个联合类型**排除**其中一个类型
- Extract: 从一个联合类型**选择**其中一个类型
- Readonly: 把所有属性转换为只读的
- Partial: 把所有属性转换为可选的
- Pick: 选择对象类型中的部分key
- Omit: 过滤掉对象类型中的部分key
- Required: 把所有属性转换为必选的
- Record: 创建一个对象结果集，第一个参数为key，第二个参数为value，我们只能创建这里面字段值

```ts
interface UtilityFirst {
  name: string;
}
interface UtilityLast {
  age: number;
}
type TypesTest = UtilityFirst | UtilityLast;
const ExcludeObjJson: Exclude<TypesTest, UtilityLast> = {
  name: "前端娱乐圈"
};
const ExtractObjJson: Extract<TypesTest, UtilityLast> = {
  age: 1
};
const ReadonlyObjJson: Readonly<UtilityFirst> = {
  name: "前端娱乐圈"
}:
const PartialObjJson: Partial<UtilityFirst> = {};

interface UtilityFirstForPickOmit {
  name: string;
  age: number;
  hobby: [];
}
const PickObjJson: Pick<UtilityFirstForPickOmit, "name" | "age"> = {
  name: "前端娱乐圈",
  age: 18
};
const OmitObjJson: Omit<UtilityFirstForPickOmit, "name" | "age"> = {
  hobby: ["code", "羽毛球"]
}

interface UtilityFirstForRequired {
  name?: string;
  age?: number;
  hobby?: string[];
}
const ObjJson: Required<UtilityFirstForRequired> = {
  name: "蛙人",
  age: 18,
  hobby: ["code"]
};

type IndexList = 0 | 1 | 2;
const ObjJson: Record<IndexList, "前端娱乐圈"> = {
  0: "前端娱乐圈",
  1: "前端娱乐圈",
  2: "前端娱乐圈",
}
```
